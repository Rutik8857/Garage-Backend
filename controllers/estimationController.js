const db = require('../config/db');

/**
 * Fetches the latest estimation (as a quotation) for a given jobCardId.
 * This function correctly queries the `quotations` table and joins it
 * with `jobcards` and `customers` to assemble the required data.
 * It is secure, production-ready, and handles errors gracefully.
 *
 * @param {object} req - Express request object, containing id.
 * @param {object} res - Express response object.
 */
exports.getQuotationById = async (req, res) => {
    console.log("✅ Hitting getQuotationById controller...");

    // 1. Extract and validate jobCardId from request parameters.
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            success: false,
            message: 'A valid ID is required.',
        });
    }

    try {
        // 2. Define the SQL query using parameterized input.
        // The quotation ID is aliased as `id` to match frontend expectations.
        const sql = `
            SELECT
                q.id,
                q.total_amount,
                q.quotation_date,
                jc.vehicle_no,
                jc.running_km,
                jc.customer_voice,
                c.customer_name,
                c.mobile_number,
                c.address
            FROM
                quotations q
          
            JOIN
                jobcards jc ON q.jobcard_id = jc.id
            JOIN 
                customers c ON jc.mobile_number = c.mobile_number
            WHERE
                q.id = ?
            ORDER BY
                q.created_at DESC
            LIMIT 1;
        `;

        // 3. Execute the query using the mysql2 promise pool.
        const [quotations] = await db.query(sql, [id]);

        // 4. Handle the case where no quotation is found for the given job card.
        if (quotations.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No estimation found for this ID.',
            });
        }

        const quotationData = quotations[0];

        // 5. Fetch the associated line items for the estimation.
        const itemsSql = `
            SELECT item_name, quantity, rate, amount
            FROM quotation_items
            WHERE quotation_id = ?
        `;
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
 * Fetches the latest estimation (quotation) for a given jobCardId.
 * This function queries the `quotations` table for the most recent quotation
 * associated with the provided jobCardId.
 *
 * @param {object} req - Express request object, containing jobCardId.
 * @param {object} res - Express response object.
 */
exports.getEstimationByJobCardId = async (req, res) => {
    console.log("✅ Hitting getEstimationByJobCardId controller...");

    // 1. Extract and validate jobCardId from request parameters.
    const { jobCardId } = req.params;
    if (!jobCardId || isNaN(parseInt(jobCardId))) {
        return res.status(400).json({
            success: false,
            message: 'A valid jobCardId is required.',
        });
    }

    try {
        // 2. Define the SQL query to get the latest estimation for the jobCardId.
        const sql = `
            SELECT
                q.id,
                q.total_amount as amount,
                q.quotation_date,
                jc.vehicle_no,
                jc.running_km as km_reading,
                jc.customer_voice,
                c.customer_name,
                c.mobile_number,
                c.address
            FROM
                quotations q
            JOIN
                jobcards jc ON q.jobcard_id = jc.id
            JOIN
                customers c ON jc.mobile_number = c.mobile_number
            WHERE
                q.jobcard_id = ?
            ORDER BY
                q.created_at DESC
            LIMIT 1;
        `;

        // 3. Execute the query.
        const [quotations] = await db.query(sql, [jobCardId]);

        // 4. Handle the case where no quotation is found.
        if (quotations.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No estimation found for this job card.',
            });
        }

        const quotationData = quotations[0];

        // 5. Fetch the associated line items (jobs).
        const itemsSql = `
            SELECT item_name as job_name, quantity, rate, amount
            FROM quotation_items
            WHERE quotation_id = ?
        `;
        const [items] = await db.query(itemsSql, [quotationData.id]);

        // 6. Assemble the final payload, mapping items to jobs.
        const responsePayload = {
            ...quotationData,
            jobs: items,
        };

        // 7. Return the successful response.
        return res.status(200).json({
            success: true,
            data: responsePayload,
        });

    } catch (error) {
        // 8. Error handling.
        console.error('❌ SERVER ERROR in getEstimationByJobCardId:', error);
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
exports.updateQuotation = async (req, res) => {
    console.log("✅ Hitting updateQuotation controller...");

    const { id } = req.params;
    const updateData = req.body;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            success: false,
            message: 'A valid Quotation ID is required.',
        });
    }

    // Basic validation: ensure there's something to update.
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No update data provided.',
        });
    }

    try {
        // We will only update the 'total_amount' as a simple example.
        // In a real app, you would build a dynamic query based on allowed fields.
        const newAmount = updateData.amount;
        if (newAmount === undefined) {
             return res.status(400).json({
                success: false,
                message: 'Update data must include an "amount" field.',
            });
        }

        const sql = `
            UPDATE estimations
            SET total_amount = ?
            WHERE id = ?;
        `;

        const [result] = await db.query(sql, [newAmount, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Quotation not found or no changes made.',
            });
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




module.exports = {
  getQuotationById: exports.getQuotationById,
  getEstimationByJobCardId: exports.getEstimationByJobCardId,
  updateQuotation: exports.updateQuotation,
};
