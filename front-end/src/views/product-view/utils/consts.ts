export const descriptionStyles = `
    .description-container {
        font-size: 16px;
        line-height: 1.8;
        color: #333;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        margin-bottom: 20px;
    
    h1, h2, h3, h4, h5, h6 {
        color: #036753;
        margin-top: 18px;
        margin-bottom: 10px;
        font-weight: bold;
    }

    p {
        font-size: 17px;
        color: #444;
        line-height: 1.8;
        margin-bottom: 12px;
    }
    
    strong, b {
        font-weight: bold;
    }

    span {
        font-size: 16px;
        color: #444;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
        font-size: 16px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        overflow: hidden;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 14px;
        text-align: left;
    }
    th {
        background-color: #036753;
        color: white;
        font-weight: bold;
    }
    tr:nth-child(even) {
        background-color: #f9f9f9;
    }
    tr:hover {
        background-color: #f1f1f1;
    }
    @media (max-width: 768px) {
        table {
            font-size: 14px;
        }
        th, td {
            padding: 10px;
        }
    }

    a {
        color: #036753;
        font-weight: bold;
        text-decoration: none;
        transition: all 0.3s ease;
    }
    a:hover {
        color: #024E42;
        text-decoration: underline;
    }
    button {
        background: #036753;
        color: white;
        font-size: 16px;
        padding: 10px 15px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    button:hover {
        background: #024E42;
    }

    iframe {
        width: 100%;
        max-width: 720px;
        height: 400px;
        display: block;
        margin: 15px auto;
        border-radius: 6px;
    }

    hr {
        border: none;
        height: 2px;
        background: #036753;
        margin: 15px 0;
    }
    
    ul li, ol li {
        margin-bottom: 6px;
        font-family: inherit !important;
        font-weight: 500;
        font-size: 16px !important;
        line-height: 1.8 !important;
        padding: 10px 14px;
        border-bottom: 1px solid #ddd;
        list-style: none;
    }
    ul li:last-child, ol li:last-child {
        border-bottom: none;
    }
    // li:nth-child(even)::before {
    //     content: "• ";
    //
    // }
    //
    // li::before {
    //     content: "• ";
    //     color: black!important;
    // }
    
    li {
         background-color: #f9f9f9;
         color: black!important;
    }
    li:nth-child(even) {
        background-color: #f9f9f9;
        color: black!important;
    }
    
    
    li span {
       color: black!important;
    }
    
    li:nth-child(even) span {
       color: black!important;
    }
    
    ul li[style*="color: #00d78a"]::before {
        content: none;
    }
    }
   
    .short-description .geo-char {
       display: none;
    }
    
    
    .full-description .geo-char {
       margin-top: 15px;
    }
    
    .full-description {
       padding: 20px;
    }
    
    .full-characteristic {
       padding: 20px;
    }
    
    .short-description {
        max-height: 275px;
        padding: 20px 20px 0 20px;
        
        .geo-descr {
            display: block;
        }

        .geo-descr {
            counter-reset: list-item;
        }
        
        .geo-descr span {
            display: block;
            position: relative;
            padding-left: 20px;
            margin-bottom: 5px;
        }
        .geo-descr span::before {
            content: "•";
            position: absolute;
            left: 0;
        }
    
    }
    
    .description-container span, 
    .description-container p {
        font-family: inherit !important;
        font-size: 16px !important;
        color: black !important;
        line-height: 1.8 !important;
    }
    
  
    
    .geo-char, .geo-wrap, .tab-pane {
    width: 100%;
    display: block;
}


.geo-wrap p,
.geo-wrap span,
.tab-pane p,
.tab-pane span {
    width: 100%;
    font-family: inherit !important;
    font-weight: 500;
    font-size: 16px !important;
    line-height: 1.8 !important;
}

.geo-char .rtejustify span {
    display: inline;
}

.with-image p,
.with-image span {
   display: block;
   color: red;
}


.tab-pane li span {
    width: auto;
    display: inline;
}

.full-characteristic li span {
    font-weight: 500!important;
}
.description-container li b,
.description-container li span {
    font-weight: 500!important;
}

.properties-sublist__el{
    display: flex;
}

.properties-list__el-title{
    font-size: 22px;
    margin-bottom: 20px;
    background: white;
}

.properties-list__el {
    background: white!important;
}

.properties-sublist__el-title {
    margin-right: 15px;
    width: 50%;
}

.properties-sublist__el-value {
    width: 50%;
}
`;
