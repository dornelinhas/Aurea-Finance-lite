const base = "http://localhost:3001/api";

const categories = [
    { name: "SalÃ¡rio",      type: "income",  budget_limit: 0,    color: "#34C759" },
    { name: "Freelance",    type: "income",  budget_limit: 0,    color: "#5AC8FA" },
    { name: "Investimento", type: "income",  budget_limit: 0,    color: "#5856D6" },
    { name: "Outros",       type: "income",  budget_limit: 0,    color: "#8E8E93" },
    { name: "Moradia",      type: "expense", budget_limit: 2000, color: "#AF52DE" },
    { name: "AlimentaÃ§Ã£o",  type: "expense", budget_limit: 800,  color: "#FF9500" },
    { name: "Transporte",   type: "expense", budget_limit: 400,  color: "#FF3B30" },
    { name: "SaÃºde",        type: "expense", budget_limit: 300,  color: "#FF2D55" },
    { name: "Lazer",        type: "expense", budget_limit: 500,  color: "#FFCC00" },
    { name: "EducaÃ§Ã£o",     type: "expense", budget_limit: 600,  color: "#007AFF" },
    { name: "Compras",      type: "expense", budget_limit: 500,  color: "#FF9500" },
    { name: "Assinaturas",  type: "expense", budget_limit: 200,  color: "#5AC8FA" }
];

async function seed() {
    console.log("Cleaning old categories...");
    const currentCatsRes = await fetch(`${base}/categories`);
    const currentCats = await currentCatsRes.json();
    for (const c of currentCats) {
        await fetch(`${base}/categories/${c.id}`, { method: 'DELETE' });
    }

    console.log("Creating new categories with UTF8...");
    for (const cat of categories) {
        const res = await fetch(`${base}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cat)
        });
        if (!res.ok) {
            console.error(`Failed to create category: ${cat.name}`);
        }
    }
    console.log("Successfully recreated categories with correct encoding!");
}

seed().catch(console.error);
