import JWT from "jsonwebtoken";
import db from "../models/index.js";

export const verifyJwtToken = async (req, response, next) => {
  const authHeaders = req.headers["authorization"];
  const apiKeyHeaders = req.headers["x-api-key"];
  console.log("Auth headers");
  console.log(authHeaders);
  let data = JSON.stringify({
    body: req.body || null,
    query: req.query || null,
    params: req.params || null,
  });
  if (typeof authHeaders !== "undefined") {
    const parts = authHeaders.split(" ");
    req.token = parts[1];

    const authData = await new Promise((resolve, reject) => {
      JWT.verify(req.token, process.env.SecretJwtKey, (error, decoded) => {
        if (error) reject(error);
        else resolve(decoded);
      });
    });
    let user = authData.user;
    db.UserActivityModel.create({
      action: req.url,
      method: req.method,
      activityData: data,
      userId: user.id,
      authMethod: "jwt",
      headers: JSON.stringify(authHeaders),
    });

    next();
  } else {
    response.send({
      status: false,
      message: "Unauthenticated user",
      data: null,
    });
  }
};

export const verifyJwtTokenOptional = (req, response, next) => {
  const authHeaders = req.headers["authorization"];
  const apiKeyHeaders = req.headers["x-api-key"];
  console.log("Auth headers");
  console.log(authHeaders);
  let data = JSON.stringify({
    body: req.body || null,
    query: req.query || null,
    params: req.params || null,
  });
  if (typeof authHeaders !== "undefined") {
    const parts = authHeaders.split(" ");
    req.token = parts[1];
    next();
  } else {
    req.token = null;
    db.UserActivityModel.create({
      action: req.url,
      method: req.method,
      activityData: data,
      userId: null,
      authMethod: "none",
      headers: JSON.stringify(authHeaders),
    });
    next();
    // response.send({status: false, message: "Unauthenticated user", data: null});
  }
};

// export {{verifyJwtToken, verifyJwtTokenOptional}verifyJwtTokenOptional};
