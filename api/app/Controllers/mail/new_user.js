
// get parameter email and name to embed in the email



const { email, complete_name } = req.body;

// convert this html to return string
function getNewUserForm() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome Email</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 10px 0;
            }
            .header img {
                width: 100px;
            }
            .content {
                padding: 20px;
            }
            .content h1 {
                color: #333;
            }
            .content p {
                line-height: 1.6;
            }
            .button {
                display: block;
                width: 200px;
                margin: 20px auto;
                padding: 10px 0;
                text-align: center;
                background-color: #28a745;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                text-align: center;
                padding: 10px 0;
                font-size: 12px;
                color: #999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://via.placeholder.com/100" alt="Company Logo">
            </div>
            <div class="content">
                <h1>Welcome to Todo!</h1>
                <p>Hi `+ complete_name +`,</p>
                <p>We are thrilled to have you on board. Thank you for joining us at Todo. We are committed to providing you with the best service possible.</p>
                <p>To get started, please click the button below:</p>
                <a href="https://todo.com" class="button">Get Started</a>
                <p>If you have any questions or need assistance, feel free to reply to this email or contact our support team at support@todo.com.</p>
                <p>Best regards,<br>The Todo Team</p>
            </div>
            <div class="footer">
                <p>&copy; `+ 
                // insert current whole year
                new Date().getFullYear()
                +` Todo. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// export the function
module.exports = getNewUserForm;