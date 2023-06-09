import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Vendor } from "../models/vendorModel";
import { string } from "joi";
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MPA CASH DOCS",
      version: "1.0.0",
      description: "Mpa Cash Documentation ",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      // securitySchemas: {
      //   bearerAuth: {
      //     type: "http",
      //     scheme: "bearer",
      //     bearerFormat: "JWT",
      //   },
      schemas: {
        Vendor: {
          type: "object",
          properties: {
            username: { type: "string" },
            full_name: { type: "string" },
            email: { type: "string" },
            phone_number: { type: "string" },
            password: { type: "string" },
          },
          required: [
            "username",
            "full_name",
            "phone_name",
            "email",
            "password",
          ],
        },
      },
      responses: {
        401: {
          description: "No token Found",
          contents: "application/json",
        },
        400: {
          description: "Invalid token Found",
          contents: "application/json",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/vendorRoutes.ts"],
};
export default options;
