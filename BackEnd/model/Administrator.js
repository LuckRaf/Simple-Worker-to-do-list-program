const db = require('../config/database')

class Administrator {
    static async getAdminGroupData(user_id) {
    // 1. Ambil workcode user
    const workcodeSql = `SELECT workcode FROM Account WHERE id = ?`;
    const [workcodeRows] = await db.execute(workcodeSql, [user_id]);

    if (workcodeRows.length === 0) return null; // user tidak ditemukan

    const workcode = workcodeRows[0].workcode;

    // 2. Sum data Attended, OnReview, Completed untuk semua worker dengan workcode sama
    const sumSql = `
        SELECT 
        SUM(ad.Attended) AS totalAttended,
        SUM(ad.OnReview) AS totalOnReview,
        SUM(ad.Completed) AS totalCompleted
        FROM Account a
        JOIN AccountData ad ON a.id = ad.account_id
        WHERE a.workcode = ?
  `;

    const [sumRows] = await db.execute(sumSql, [workcode]);

    // sumRows[0] akan berisi { totalAttended, totalOnReview, totalCompleted }
    return sumRows[0];
}


}

module.exports = Administrator