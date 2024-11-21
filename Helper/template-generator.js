exports.generateReportTemplate = (templateData, title) => {
    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>${title}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        margin-bottom: 20px;
                    }

                    .container {
                        width: 80%;
                        margin: 20px auto;
                        overflow: hidden;
                        text-align: center;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    th,
                    td {
                        border: 1px solid #a19e9e;
                        padding: 8px;
                        text-align: center;
                    }
                    th {
                        background-color: #4d6f9a;
                        color: white;
                    }
                    tbody tr:nth-child(even) {
                        background-color: #e5e8ec;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>${title}</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>S No</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Exam</th>
                                <th>Score</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>`
    templateData.forEach((item, index) => {
        html += `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${item.name}</td>
                                    <td>${item.email}</td>
                                    <td>${item.quiz}</td>
                                    <td>${item.score}</td>
                                    <td>${item.date}</td>
                                </tr>`
    })

    html += `
                    </tbody>
                </table>
            </div>
        </body>
    </html>`

    return html
}