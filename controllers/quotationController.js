const db = require('../config/db');

/**
 * Fetches all quotations.
 * This function queries the `quotations` table and joins it
 * with `jobcards` and `customers` to assemble the required data.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getAllQuotations = async (req, res) => {
    // 1. Pagination Params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search;

    try {
        let whereClause = '';
        let queryParams = [];

        if (search) {
            whereClause = `
                WHERE (
                    c.customer_name LIKE ? OR 
                    q.vehicle_number LIKE ? OR 
                    c.mobile_number LIKE ?
                )
            `;
            const term = `%${search}%`;
            queryParams = [term, term, term];
        }

        // 2. Get Total Count
        const countSql = `
            SELECT COUNT(*) as total 
            FROM quotations q
            LEFT JOIN customers c ON q.customer_id = c.id
            ${whereClause}
        `;
        const [countResult] = await db.query(countSql, queryParams);
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        // 3. Get Paginated Data
        const dataSql = `
            SELECT
                q.id,
                q.total_amount,
                q.quotation_date,
                q.vehicle_number,
                q.created_at,
                c.customer_name,
                c.mobile_number,
                c.address,
                (SELECT COUNT(*) FROM quotation_items qi WHERE qi.quotation_id = q.id) as item_count
            FROM
                quotations q
            LEFT JOIN
                customers c ON q.customer_id = c.id
            ${whereClause}
            ORDER BY
                q.quotation_date DESC
            LIMIT ? OFFSET ?
        `;

        const [quotations] = await db.query(dataSql, [...queryParams, limit, offset]);

        return res.status(200).json({
            success: true,
            data: quotations,
            pagination: {
                totalRecords,
                currentPage: page,
                totalPages,
                limit
            }
        });

    } catch (error) {
        console.error('❌ SERVER ERROR in getAllQuotations:', error);
        return res.status(500).json({
            success: false,
            message: 'A server error occurred while fetching quotations.',
            error: error.message,
        });
    }
};

/**
 * Fetches a quotation by its ID.
 * This function correctly queries the `quotations` table and joins it
 * with `jobcards` and `customers` to assemble the required data.
 * It is secure, production-ready, and handles errors gracefully.
 *
 * @param {object} req - Express request object, containing quotation ID.
 * @param {object} res - Express response object.
 */
const getQuotationById = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            success: false,
            message: 'A valid ID is required.',
        });
    }

    try {
        // 2. Fetch Quotation (Support both Standalone and JobCard linked)
        const sql = `
            SELECT 
                q.*,
                c.customer_name,
                c.mobile_number,
                c.address
            FROM quotations q
            LEFT JOIN customers c ON q.customer_id = c.id
            WHERE q.id = ?
        `;

        // 3. Execute the query using the mysql2 promise pool.
        const [rows] = await db.query(sql, [id]);

        // 4. Handle the case where no quotation is found.
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Quotation not found.',
            });
        }

        const quotationData = rows[0];

        // 5. Fetch the associated line items for the quotation.
        const itemsSql = `SELECT * FROM quotation_items WHERE quotation_id = ?`;
        const [items] = await db.query(itemsSql, [id]);

        // 6. Assemble the final payload.
        const responsePayload = {
            ...quotationData,
            items: items,
        };

        // 7. Return the successful response.
        return res.status(200).json({
            success: true,
            data: responsePayload,
        });

    } catch (error) {
        // 8. Implement robust error handling for any unexpected server issues.
        console.error('❌ SERVER ERROR in getQuotationById:', error);
        
        if (error.code === 'ER_BAD_FIELD_ERROR') {
             return res.status(500).json({
                success: false,
                message: "Database schema error: A column in the query does not exist.",
                details: error.message
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'A server error occurred while fetching the estimation data.',
            error: error.message,
        });
    }
};

/**
 * Updates an existing quotation.
 * Handles PATCH requests to update quotation details based on quotation ID.
 *
 * @param {object} req - Express request object with quotation ID in params and update data in body.
 * @param {object} res - Express response object.
 */
const updateQuotation = async (req, res) => {
    const { id } = req.params;
    const { customerId, vehicleNumber, quotationDate, items } = req.body;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            success: false,
            message: 'A valid Quotation ID is required.',
        });
    }

    // Basic validation
    if (!customerId || !vehicleNumber || !items || !Array.isArray(items)) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields (customerId, vehicleNumber, items).',
        });
    }

    try {
        // 1. Calculate Total Amount
        const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const qDate = quotationDate ? new Date(quotationDate) : new Date();

        // 2. Update Quotation Record
        const updateSql = `
            UPDATE quotations
            SET customer_id = ?, vehicle_number = ?, quotation_date = ?, total_amount = ?
            WHERE id = ?
        `;

        const [result] = await db.query(updateSql, [customerId, vehicleNumber, qDate, totalAmount, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Quotation not found.',
            });
        }

        // 3. Update Items (Delete all and re-insert)
        await db.query('DELETE FROM quotation_items WHERE quotation_id = ?', [id]);

        if (items.length > 0) {
            const insertItemsSql = `INSERT INTO quotation_items (quotation_id, item_name, hsn, quantity, rate, gst_percent, amount) VALUES ?`;
            const itemValues = items.map(item => [
                id,
                item.itemName,
                item.hsn || null,
                item.quantity,
                item.rate,
                item.gst || 0,
                item.amount
            ]);
            await db.query(insertItemsSql, [itemValues]);
        }

        return res.status(200).json({
            success: true,
            message: 'Quotation updated successfully.',
        });

    } catch (error) {
        console.error('❌ SERVER ERROR in updateQuotation:', error);
        return res.status(500).json({
            success: false,
            message: 'A server error occurred while updating the quotation.',
            error: error.message,
        });
    }
};

/**
 * Creates a new quotation.
 * Handles POST requests to create a new quotation with items.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const createQuotation = async (req, res) => {
    const { customerId, vehicleNumber, items, quotationDate } = req.body;

    if (!customerId || !vehicleNumber || !items || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Customer, Vehicle Number, and at least one item are required.',
        });
    }

    try {
        // Calculate total amount
        const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const qDate = quotationDate || new Date();

        // Insert into quotations table
        const insertQuotationSql = `
            INSERT INTO quotations (customer_id, vehicle_number, quotation_date, total_amount)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.query(insertQuotationSql, [customerId, vehicleNumber, qDate, totalAmount]);
        const quotationId = result.insertId;

        // Insert items
        if (items.length > 0) {
            const insertItemsSql = `INSERT INTO quotation_items (quotation_id, item_name, hsn, quantity, rate, gst_percent, amount) VALUES ?`;
            const itemValues = items.map(item => [
                quotationId,
                item.itemName,
                item.hsn || null,
                item.quantity,
                item.rate,
                item.gst || 0,
                item.amount
            ]);
            await db.query(insertItemsSql, [itemValues]);
        }

        return res.status(201).json({
            success: true,
            message: 'Quotation created successfully.',
            quotationId: quotationId
        });

    } catch (error) {
        console.error('❌ SERVER ERROR in createQuotation:', error);
        return res.status(500).json({
            success: false,
            message: 'A server error occurred while creating the quotation.',
            error: error.message,
        });
    }
};

/**
 * Deletes a quotation and its items.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const deleteQuotation = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM quotation_items WHERE quotation_id = ?', [id]);
        const [result] = await db.query('DELETE FROM quotations WHERE id = ?', [id]);

        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Quotation not found.' });
        return res.status(200).json({ success: true, message: 'Quotation deleted successfully.' });
    } catch (error) {
        console.error('Error deleting quotation:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = {
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  createQuotation,
  deleteQuotation,
};
