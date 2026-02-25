import { v4 as uuidv4 } from "uuid";
import type { IDocument } from "../interfaces/IGeneric";

export const initDocument: IDocument = {
    id: uuidv4(),
    name: "Detailed Project Proposal & Quotation",
    html: `
        <div class="invoice-container">
            <section class="page-break">
                <div class="hero-section">
                    <h1>Propuesta de Servicios Profesionales</h1>
                    <p class="subtitle">Preparado para: <strong>{{customerName}}</strong></p>
                </div>

                <div class="content-block">
                    <h3>1. Objetivos del Proyecto</h3>
                    <p>{{projectObjectives}}</p>
                    <div class="info-grid">
                        <div class="info-card">
                            <span class="label">Fecha de Inicio</span>
                            <span class="val">{{startDate}}</span>
                        </div>
                        <div class="info-card">
                            <span class="label">Duración Estimada</span>
                            <span class="val">{{duration}}</span>
                        </div>
                    </div>
                </div>

                <div class="content-block">
                    <h3>2. Alcance del Trabajo</h3>
                    <ul class="scope-list">
                        {{#each scopeItems}}
                        <li><strong>{{title}}:</strong> {{description}}</li>
                        {{/each}}
                    </ul>
                </div>
            </section>

            <section class="page-break">
                <h3>3. Presupuesto Detallado</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Fase / Concepto</th>
                            <th class="text-right">Horas</th>
                            <th class="text-right">Tarifa</th>
                            <th class="text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{#each items}}
                        <tr>
                            <td>
                                <div class="item-name">{{name}}</div>
                                <div class="item-description">{{description}}</div>
                            </td>
                            <td class="text-right">{{quantity}}</td>
                            <td class="text-right">{{price}}</td>
                            <td class="text-right">{{amount}}</td>
                        </tr>
                        {{/each}}
                    </tbody>
                </table>

                <div class="summary-box">
                    <div class="summary-line"><span>Subtotal:</span> <span>{{subtotal}}</span></div>
                    <div class="summary-line"><span>Impuestos (IVA):</span> <span>{{tax}}</span></div>
                    <div class="summary-line total"><span>Total Inversión:</span> <span>{{total}}</span></div>
                </div>
            </section>

            <section>
                <h3>4. Cronograma de Entregas</h3>
                <table class="timeline-table">
                    <tr><th>Hito</th><th>Fecha Entrega</th><th>Entregable</th></tr>
                    {{#each milestones}}
                    <tr>
                        <td>{{milestone}}</td>
                        <td>{{date}}</td>
                        <td>{{deliverable}}</td>
                    </tr>
                    {{/each}}
                </table>

                <div class="legal-section">
                    <h3>5. Términos y Condiciones</h3>
                    <div class="legal-text">
                        {{termsAndConditions}}
                    </div>
                </div>

                <div class="signature-section">
                    <div class="sig-box"><p>Aceptado por Cliente</p></div>
                    <div class="sig-box"><p>Representante Acme Corp</p></div>
                </div>
            </section>
        </div>
    `,
    css: `
        :root { --primary: #0f172a; --accent: #3b82f6; --border: #e2e8f0; }
        body { font-size: 12px; line-height: 1.5; color: #334155; }
        .page-break { page-break-after: always; }
        
        .hero-section { background: var(--primary); color: white; padding: 40px; border-radius: 8px; margin-bottom: 30px; }
        .hero-section h1 { margin: 0; font-size: 28px; }
        
        .content-block { margin-bottom: 25px; }
        h3 { border-left: 4px solid var(--accent); padding-left: 10px; color: var(--primary); text-transform: uppercase; }

        .items-table, .timeline-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .items-table th, .timeline-table th { background: #f8fafc; border: 1px solid var(--border); padding: 10px; text-align: left; }
        .items-table td, .timeline-table td { border: 1px solid var(--border); padding: 10px; }

        .summary-box { margin-left: auto; width: 300px; margin-top: 20px; background: #f1f5f9; padding: 15px; border-radius: 5px; }
        .summary-line { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .total { font-weight: bold; color: var(--accent); font-size: 16px; border-top: 1px solid #cbd5e1; padding-top: 5px; }

        .legal-text { font-size: 10px; color: #64748b; text-align: justify; columns: 2; column-gap: 20px; }
        .signature-section { display: flex; justify-content: space-between; margin-top: 50px; }
        .sig-box { border-top: 1px solid #000; width: 45%; text-align: center; padding-top: 10px; margin-top: 40px; }
    `,
    sampleData: {
        "customerName": "Tech Innovators S.A.",
        "projectObjectives": "Implementación de una arquitectura de microservicios escalable para el procesamiento de pagos internacionales.",
        "startDate": "15 de Marzo, 2026",
        "duration": "6 Meses",
        "scopeItems": [
            { "title": "Auditoría", "description": "Análisis de la infraestructura legacy actual." },
            { "title": "Desarrollo", "description": "Construcción de 5 microservicios core en Go." },
            { "title": "Despliegue", "description": "Configuración de clusters Kubernetes en AWS." }
        ],
        "items": Array(12).fill({ // Llenamos con varios items para forzar el tamaño
            "name": "Módulo de Seguridad",
            "description": "Implementación de OAuth2 + OpenID Connect",
            "quantity": 40,
            "price": "$85.00",
            "amount": "$3,400.00"
        }),
        "milestones": [
            { "milestone": "Fase 1", "date": "Abril 2026", "deliverable": "Documento de Arquitectura" },
            { "milestone": "Fase 2", "date": "Junio 2026", "deliverable": "MVP en Staging" },
            { "milestone": "Fase 3", "date": "Septiembre 2026", "deliverable": "Puesta en Producción" }
        ],
        "subtotal": "$40,800.00",
        "tax": "$6,528.00",
        "total": "$47,328.00",
        "termsAndConditions": "Este presupuesto tiene una validez de 30 días. Los pagos se realizarán 50% al inicio y 50% contra entrega de hitos. Cualquier cambio en el alcance original resultará en un ajuste de costos previa aprobación por escrito de ambas partes..."
    },
    htmlHeader: `<div style="width:100%; text-align:right; font-size:10px; border-bottom:1px solid #eee;">Acme Corp | Propuesta Confidencial</div>`,
    htmlFooter: `<div style="width:100%; display:flex; justify-content:space-between; font-size:10px; border-top:1px solid #eee;"><span>© 2026 Acme Corp</span><span>Página <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    printConfig: {
        layout: { format: 'letter', orientation: false, width: 216, height: 279, unit: 'mm' },
        margin: { top: 25, right: 20, bottom: 25, left: 20 },
        options: { scale: 100, printBackground: true, pageNumbers: true }
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    userCreated: "admin",
    userUpdated: "admin"
};