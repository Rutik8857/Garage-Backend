const db = require("../config/db");

const getModelsByMake = async (req, res) => {
    const { make, make_id } = req.query;

    if (!make && !make_id) {
        return res.status(400).json({ message: "make or make_id is required" });
    }

    try {
        let makeId = make_id;

        if (!makeId) {
            // 🔥 SAFE + CASE INSENSITIVE
            const [makeRows] = await db.query(
                "SELECT id FROM makes WHERE TRIM(LOWER(name)) = TRIM(LOWER(?))",
                [make]
            );
            console.log("MAKE RECEIVED:", make);

            if (makeRows.length === 0) {
                return res.status(404).json({
                    message: "Make not found in database",
                    received: make
                });
            }
            makeId = makeRows[0].id;
        }

        const [models] = await db.query(
            "SELECT id, name FROM models WHERE make_id = ?",
            [makeId]
        );

        return res.json(models);

    } catch (err) {
        console.error("MODEL API ERROR:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getModelsByMake };
