import db from "../../db/connect.js";
export const getDeposit = (req, res) => {
  console.log(req, res);
  //implement
};
export const disposit = async (req, res, next) => {
  try {
    const user_id = req.body.user_id;
    const receiver = null;
    const note = req.body?.note;
    const amount = req.body.amount;
    const bank = req.body.bank;
    // eslint-disable-next-line no-undef
    const user = await new Promise((resolve, reject) => {
      db.query(
        "SELECT balance, firstname FROM `users` WHERE id = ?",
        [user_id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result[0]);
          }
        }
      );
    });
    const data = [
      [user_id, user.firstname, receiver, note, amount, bank, "disposit"],
    ];
    db.query(
      "INSERT INTO banks (`owner`, `sender`, `receiver`,`note`, `amount`, `bank`, `type`) VALUES ?",
      [data],
      (err, result) => {
        if (err) {
          console.log(err);
          throw err;
        } else {
          db.query("UPDATE users SET balance = ? WHERE id = ?", [
            user.balance + amount,
            user_id,
            (err) => {
              if (err) {
                console.log(err);
                throw err;
              }
            },
          ]);
          return res.json({
            success: true,
            data: "disposit success",
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
    return next();
  }
};
