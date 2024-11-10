import Users from "../../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  console.log("refresh token called:", req.headers["authorization"]);
  try {
    const refreshToken = req.headers["authorization"];

    if (!refreshToken) {
      console.log("No refresh token provided");
      return res.sendStatus(401);
    }

    const token = refreshToken.replace("Bearer ", "");

    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          console.log("Failed to verify refresh token", err);
          return res.sendStatus(403);
        }

        const user = await Users.findOne({
          where: {
            jwt_token: token,
          },
        });

        if (!user) {
          console.log("Refresh token not found in database");
          return res.sendStatus(401);
        }

        const { uuid, username, namalengkap, role } = user;

        const newAccessToken = jwt.sign(
          { uuid, username, namalengkap, role },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1h",
          }
        );

        res.json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    console.error("Error in refreshToken handler", error);
    res.sendStatus(500);
  }
};
