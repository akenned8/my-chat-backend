"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qaconfig = void 0;
exports.qaconfig = {
    PORT: process.env.PORT || 5000,
    UI_ORIGIN: process.env.UI_ORIGIN || "http://localhost:3000",
    DB_URI: process.env.DB_URI || "",
    NODE_ENV: process.env.NODE_ENV || "QA",
};
//# sourceMappingURL=qaconfig.js.map