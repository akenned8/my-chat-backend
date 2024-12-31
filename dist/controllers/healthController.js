"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = void 0;
const getHealth = (req, res) => {
    res.status(200).json({ status: 'UP' });
};
exports.getHealth = getHealth;
//# sourceMappingURL=healthController.js.map