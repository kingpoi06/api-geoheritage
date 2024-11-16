import Users from "../../models/UserModel.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

export const postLogin = async (req, res) => {
  console.log("postLogin called");
  try {
    const user = await Users.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ msg: "Akun tidak terdaftar" });
    }

    const match = await argon2.verify(user.password, req.body.password);
    if (!match) {
      console.log("Password mismatch");
      return res
        .status(400)
        .json({ msg: "Password Salah. Silahkan Masukan Lagi!" });
    }

    const { uuid, username, namalengkap, role } = user;

    const accessToken = jwt.sign(
      { uuid, username, namalengkap, role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "900s",
      }
    );

    const refreshToken = jwt.sign(
      { uuid, username, namalengkap, role  },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "3600s",
      }
    );

    // Update jwt_token in database
    await Users.update(
      { jwt_token: refreshToken },
      {
        where: {
          uuid: user.uuid,
        },
      }
    );

    // Initialize req.session if not already initialized
    if (!req.session) {
      req.session = {};
    }

    // Set userId in req object
    req.session.userId = user.uuid;
    req.userId = user.uuid;

    // Save session
    req.session.userData = {
      uuid: user.uuid,
      username: user.username,
      namalengkap: user.namalengkap,
      email: user.email,
      jabatan: user.jabatan,
      satuankerja: user.satuankerja,
      role: user.role,
    };

    // Send tokens in response
    res.set("Authorization", `Bearer ${accessToken}`);
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("postLogin error:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const deleteLogout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Periksa apakah refresh token tersedia
    if (!refreshToken) {
      return res.status(401).json({ msg: "Refresh token is required" }); // Unauthorized
    }

    // Verifikasi token
    let decodedToken;
    try {
      decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      console.error("Invalid refresh token:", err);
      return res.status(403).json({ msg: "Invalid refresh token" }); // Forbidden
    }

    // Cari user berdasarkan UUID dan token refresh yang dikirim
    const user = await Users.findOne({
      where: {
        uuid: decodedToken.uuid,
        jwt_token: refreshToken, // Cocokkan dengan token yang tersimpan
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" }); // Not Found
    }

    // Hapus token refresh dari database
    await Users.update(
      { jwt_token: null }, // Set token refresh menjadi null
      { where: { uuid: user.uuid } }
    );

    // Berikan respons sukses
    res.status(200).json({ msg: "Successfully logged out" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ msg: "Failed to logout" }); // Internal Server Error
  }
};
