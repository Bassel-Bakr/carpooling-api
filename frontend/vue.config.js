module.exports = {
    outputDir: "../backend/public",
    devServer: {
        proxy: {
            ".*": {
                target: "http://localhost:3000/",
                ws: true
                // pathRewrite: {
                //     "api": ""
                // }
            }
        }
    }
};