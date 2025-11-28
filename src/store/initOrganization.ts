import { v4 as uuidv4 } from "uuid";
import type { IDocument } from "../interfaces/IGeneric";




export const initDocument: IDocument = {
    id: uuidv4(),           // or '' if you want to assign later
    name: "Untitled document",
    html: `
        <div class="invoice">
        <h1>Invoice</h1>
        <p><strong>Customer:</strong> {{customerName}}</p>
        <p><strong>Date:</strong> {{date}}</p>

        <table class="items">
            <thead>
            <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
            </tr>
            </thead>
            <tbody>
            {{#each items}}
            <tr>
                <td>{{name}}</td>
                <td>{{quantity}}</td>
                <td>{{price}}</td>
            </tr>
            {{/each}}
            </tbody>
        </table>

        <p class="total"><strong>Total:</strong> {{total}}</p>
        </div>
    `,
    css: `
        .invoice {
        font-family: Arial, sans-serif;
        padding: 20px;
        }

        .invoice h1 {
        text-align: center;
        margin-bottom: 20px;
        }

        .items {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        }

        .items th, .items td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
        }

        .total {
        text-align: right;
        margin-top: 20px;
        font-size: 18px;
        }

    `,
    // jsonStructure: "{}",      // empty schema by default
    sampleData: {
        "customerName": "John Doe",
        "date": "2025-09-27",
        "items": [
            { "name": "Product A", "quantity": 2, "price": "$10" },
            { "name": "Product B", "quantity": 1, "price": "$20" },
            { "name": "Service C", "quantity": 3, "price": "$15" }
        ],
        "total": "$95"
    }
    ,
    createdAt: new Date(),
    updatedAt: new Date(),
    userCreated: "",
    userUpdated: ""
};