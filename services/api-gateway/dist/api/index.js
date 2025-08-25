"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
let app;
exports.default = async (req, res) => {
    if (!app) {
        app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({
            origin: ['https://your-frontend.vercel.app'],
            credentials: true,
        });
        await app.init();
    }
    return app.getHttpAdapter().getInstance()(req, res);
};
//# sourceMappingURL=index.js.map