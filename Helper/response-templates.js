exports.SUCCESS_TEMPLATE = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Server Status</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #2c3e50 0%, #4a4a4a 100%);
                    font-family: 'Arial', sans-serif;
                    color: #ecf0f1;
                }
                .container {
                    text-align: center;
                    background: rgba(44, 62, 80, 0.9);
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                    animation: fadeIn 2s ease-in-out, slideIn 1s ease-in-out;
                }
                h1 {
                    font-size: 40px;
                    margin-bottom: 20px;
                }
                p {
                    font-size: 18px;
                    margin: 10px 0;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin-top: 20px;
                    background-color: #31bd2c;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                }
                .button:hover {
                    background-color: #2aa126;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(-20px); }
                    to { transform: translateY(0); }
                }
                @media (max-width: 600px) {
                    h1 {
                        font-size: 30px;
                    }
                    p {
                        font-size: 16px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Server is up and running. 😃</h1>
                <p>Welcome to our server status page. Everything is working perfectly.</p>
                <p>For any inquiries, please contact developer.</p>
                <a href="mailto:support@example.com" class="button">Success</a>
            </div>
        </body>
        </html>
    `

exports.FAILURE_TEMPLATE = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Server Status</title>
        <style>
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                font-family: 'Arial', sans-serif;
                color: #ecf0f1;
            }
            .container {
                text-align: center;
                background: rgba(231, 76, 60, 0.9);
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                animation: fadeIn 2s ease-in-out, slideIn 1s ease-in-out;
            }
            h1 {
                font-size: 40px;
                margin-bottom: 20px;
            }
            p {
                font-size: 18px;
                margin: 10px 0;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 20px;
                background-color: #e74c3c;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #c0392b;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-20px); }
                to { transform: translateY(0); }
            }
            @media (max-width: 600px) {
                h1 {
                    font-size: 30px;
                }
                p {
                    font-size: 16px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Server is currently down. 😞</h1>
            <p>We are experiencing some issues. Please bear with us as we work to resolve them.</p>
            <p>For any inquiries, please contact developer.</p>
            <a href="mailto:support@example.com" class="button">Failure</a>
        </div>
    </body>
    </html>
`;


exports.NOT_FOUND_TEMPLATE = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 Not Found</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    font-family: 'Arial', sans-serif;
                    color: #ecf0f1;
                }
                .container {
                    text-align: center;
                    background: rgba(231, 76, 60, 0.9);
                    padding: 20px;
                    padding-top: 20px;
                    padding-bottom: 30px;
                    border-radius: 10px;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                    animation: fadeIn 2s ease-in-out, slideIn 1s ease-in-out;
                    margin: 10px;
                }
                h1 {
                    font-size: 40px;
                    margin-bottom: 20px;
                }
                p {
                    font-size: 18px;
                    margin: 10px 0;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin-top: 20px;
                    background-color: #353434;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                }
                .button:hover {
                    background-color: #272626;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(-20px); }
                    to { transform: translateY(0); }
                }
                @media (max-width: 600px) {
                    h1 {
                        font-size: 30px;
                    }
                    p {
                        font-size: 16px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>404 Not Found</h1>
                <p>The page you are looking for does not exist.</p>
                <a href="/" class="button">Go Home</a>
            </div>
        </body>
        </html>
    `

exports.NOT_FOUND_TEMPLATE_2 = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>404 Page Not Found</title>
    <link href="https://fonts.googleapis.com/css?family=Gruppo" rel="stylesheet">
    <style>
        body {
            background-color: #272b30;
            color: #fff;
        }
        
        .glitch {
            font-size: 13vh;
            line-height: 1;
            font-family: 'Gruppo', cursive;
            font-weight: 400;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            margin: 0;
            text-decoration: none;
            color: #FBB071;
            text-shadow: 0px 1px 25px rgb(29, 29, 29);
        }
        
        .glitch:before,
        .glitch:after {
            display: block;
            content: '404';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            opacity: .8;
            mix-blend-mode: multiply;
        }
        
        .glitch:after {
            color: #FF835D;
            z-index: -2;
        }
        
        .glitch:before {
            color: #FBB071;
            z-index: -1;
        }
        
        .glitch:hover:before {
            animation: glitch 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
            mix-blend-mode: overlay;
        }
        
        .glitch:hover:after {
            animation: glitch 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
            mix-blend-mode: multiply;
        }
        
        @keyframes glitch {
            0% {
                -webkit-transform: translate(0);
                transform: translate(0);
            }
            20% {
                -webkit-transform: translate(-5px, 5px);
                transform: translate(-5px, 5px);
            }
            40% {
                -webkit-transform: translate(-5px, -5px);
                transform: translate(-5px, -5px);
            }
            60% {
                -webkit-transform: translate(5px, 5px);
                transform: translate(5px, 5px);
            }
            80% {
                -webkit-transform: translate(5px, -5px);
                transform: translate(5px, -5px);
            }
            to {
                -webkit-transform: translate(0);
                transform: translate(0);
            }
        }
    </style>
</head>

<body>
    <a href="#" class="glitch">404</a>
</body>

</html>`

exports.SUCCESS_TEMPLATE_2 = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Success</title>
    <link href="https://fonts.googleapis.com/css?family=Gruppo" rel="stylesheet">
    <style>
        body {
            background-color: #272b30;
            color: #fff;
        }
        
        .glitch {
            font-size: 13vh;
            line-height: 1;
            font-family: 'Gruppo', cursive;
            font-weight: 400;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            margin: 0;
            text-decoration: none;
            color: #57ce33;
            text-shadow: 0px 1px 25px rgb(29, 29, 29);
        }
        
        .glitch:before,
        .glitch:after {
            display: block;
            content: 'Success';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            opacity: .8;
            mix-blend-mode: multiply;
        }
        
        .glitch:after {
            color: #3d9921;
            z-index: -2;
        }
        
        .glitch:before {
            color: #70da50;
            z-index: -1;
        }
        
        .glitch:hover:before {
            animation: glitch 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
            mix-blend-mode: overlay;
        }
        
        .glitch:hover:after {
            animation: glitch 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
            mix-blend-mode: multiply;
        }
        
        @keyframes glitch {
            0% {
                -webkit-transform: translate(0);
                transform: translate(0);
            }
            20% {
                -webkit-transform: translate(-5px, 5px);
                transform: translate(-5px, 5px);
            }
            40% {
                -webkit-transform: translate(-5px, -5px);
                transform: translate(-5px, -5px);
            }
            60% {
                -webkit-transform: translate(5px, 5px);
                transform: translate(5px, 5px);
            }
            80% {
                -webkit-transform: translate(5px, -5px);
                transform: translate(5px, -5px);
            }
            to {
                -webkit-transform: translate(0);
                transform: translate(0);
            }
        }
    </style>
</head>

<body>
    <a href="#" class="glitch">Success</a>
</body>

</html>`