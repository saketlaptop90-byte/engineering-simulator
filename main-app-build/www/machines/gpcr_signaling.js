export function createGPCRSignalingPathway(THREE) {
    const model = new THREE.Group();
    const parts = [];

    // Helper to add parts
    function addPart(mesh, name) {
        mesh.name = name;
        model.add(mesh);
        parts.push({ name: name, mesh: mesh });
        return mesh;
    }

    // 1. Ligand
    const ligandGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const ligandMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const ligand = addPart(new THREE.Mesh(ligandGeo, ligandMat), "Ligand");

    // 2. Transmembrane Receptor
    const receptorGeo = new THREE.CylinderGeometry(1, 1, 4, 16);
    const receptorMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 });
    const receptor = addPart(new THREE.Mesh(receptorGeo, receptorMat), "Transmembrane Receptor");

    // 3. G-Alpha Subunit
    const gAlphaGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const gAlphaMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const gAlpha = addPart(new THREE.Mesh(gAlphaGeo, gAlphaMat), "G-Alpha Subunit");

    // 4. G-Beta-Gamma Complex
    const gBetaGammaGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 16);
    const gBetaGammaMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const gBetaGamma = addPart(new THREE.Mesh(gBetaGammaGeo, gBetaGammaMat), "G-Beta-Gamma Complex");

    // 5. GDP
    const gdpGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const gdpMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const gdp = addPart(new THREE.Mesh(gdpGeo, gdpMat), "GDP");

    // 6. GTP
    const gtpGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const gtpMat = new THREE.MeshStandardMaterial({ color: 0xffa500 });
    const gtp = addPart(new THREE.Mesh(gtpGeo, gtpMat), "GTP");

    // 7. Adenylyl Cyclase
    const acGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 16);
    const acMat = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const ac = addPart(new THREE.Mesh(acGeo, acMat), "Adenylyl Cyclase");

    // 8. ATP
    const atpGeo = new THREE.OctahedronGeometry(0.4);
    const atpMat = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const atp = addPart(new THREE.Mesh(atpGeo, atpMat), "ATP");

    // 9. cAMP
    const campGeo = new THREE.TetrahedronGeometry(0.4);
    const campMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const camp = addPart(new THREE.Mesh(campGeo, campMat), "cAMP");

    // 10. Protein Kinase A
    const pkaGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const pkaMat = new THREE.MeshStandardMaterial({ color: 0x800080 });
    const pka = addPart(new THREE.Mesh(pkaGeo, pkaMat), "Protein Kinase A");

    // Cell membrane (aesthetic, not counted as part of the 10 distinct parts)
    const membraneGeo = new THREE.PlaneGeometry(30, 20);
    const membraneMat = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
    const membrane = new THREE.Mesh(membraneGeo, membraneMat);
    membrane.rotation.x = Math.PI / 2;
    membrane.position.y = 0;
    model.add(membrane);

    return {
        model: model,
        parts: parts,
        update: function(time) {
            const cycle = (time * 0.5) % 10;
            
            // Base positions
            receptor.position.set(0, 0, 0);
            ac.position.set(-6, 0, 0);
            pka.position.set(-10, -3, 0);
            
            if (cycle < 2) {
                // Ligand approaches receptor
                ligand.position.set(0, 5 - (cycle / 2) * 3, 0); // 5 to 2
                gAlpha.position.set(-1, -2.5, 0);
                gBetaGamma.position.set(1, -2.5, 0);
                gdp.position.set(-1, -3.2, 0);
                gdp.visible = true;
                gdp.material.opacity = 1;
                gdp.material.transparent = true;
                gtp.position.set(-4, -2.5, 0);
                gtp.visible = true;
                atp.position.set(-6, -3, 0);
                atp.visible = false;
                camp.position.set(-6, 3, 0);
                camp.visible = false;
                
            } else if (cycle < 4) {
                // GDP leaves, GTP binds
                ligand.position.set(0, 2, 0);
                const subCycle = (cycle - 2) / 2; 
                gdp.position.set(-1, -3.2 - subCycle * 2, 0);
                gdp.material.opacity = 1 - subCycle;
                
                gtp.position.set(-4 + subCycle * 3, -2.5, 0); // -4 to -1
                
                gAlpha.position.set(-1, -2.5, 0);
                gBetaGamma.position.set(1, -2.5, 0);
                atp.visible = false;
                camp.visible = false;
            } else if (cycle < 6) {
                // G-Alpha dissociates and moves to Adenylyl Cyclase
                ligand.position.set(0, 2, 0);
                gdp.visible = false;
                
                const subCycle = (cycle - 4) / 2;
                gAlpha.position.set(-1 - subCycle * 3.5, -2.5, 0); // -1 to -4.5
                gtp.position.set(-1 - subCycle * 3.5, -2.5, 0);
                gBetaGamma.position.set(1, -2.5, 0);
                
                atp.visible = true;
                atp.position.set(-6, -3 + subCycle * 3, 0); // -3 to 0
                camp.visible = false;
            } else if (cycle < 8) {
                // ATP turns into cAMP, cAMP goes to PKA
                ligand.position.set(0, 2, 0);
                gAlpha.position.set(-4.5, -2.5, 0);
                gtp.position.set(-4.5, -2.5, 0);
                gBetaGamma.position.set(1, -2.5, 0);
                
                atp.visible = false;
                camp.visible = true;
                const subCycle = (cycle - 6) / 2;
                camp.position.set(-6 - subCycle * 4, 0 - subCycle * 3, 0); // Moves from AC to PKA
            } else {
                // Resetting for next cycle
                const subCycle = (cycle - 8) / 2;
                ligand.position.set(0, 2 + subCycle * 3, 0);
                camp.visible = false;
                gAlpha.position.set(-4.5 + subCycle * 3.5, -2.5, 0);
                gtp.position.set(-4.5, -2.5, 0);
                gtp.visible = false;
            }
        },
        questions: [
            {
                question: "What is the role of the ligand in GPCR signaling?",
                options: [
                    "To bind to the transmembrane receptor and induce a conformational change",
                    "To phosphorylate GDP to GTP",
                    "To act as a secondary messenger",
                    "To cleave cAMP"
                ],
                correctAnswer: 0
            },
            {
                question: "Which subunit of the G-protein directly binds to GTP?",
                options: [
                    "Alpha subunit",
                    "Beta subunit",
                    "Gamma subunit",
                    "Delta subunit"
                ],
                correctAnswer: 0
            },
            {
                question: "What enzyme does the activated G-alpha subunit commonly stimulate?",
                options: [
                    "Adenylyl Cyclase",
                    "Protein Kinase A",
                    "Phospholipase C",
                    "GTPase"
                ],
                correctAnswer: 0
            },
            {
                question: "What molecule does Adenylyl Cyclase convert into cAMP?",
                options: [
                    "ATP",
                    "ADP",
                    "GTP",
                    "GDP"
                ],
                correctAnswer: 0
            },
            {
                question: "What is the main target of cAMP in this signaling pathway?",
                options: [
                    "Protein Kinase A (PKA)",
                    "Adenylyl Cyclase",
                    "G-Beta-Gamma Complex",
                    "Transmembrane Receptor"
                ],
                correctAnswer: 0
            },
            {
                question: "How is the GPCR signaling pathway typically turned off?",
                options: [
                    "Hydrolysis of GTP to GDP by the G-alpha subunit",
                    "Production of more cAMP",
                    "Binding of another ligand",
                    "Activation of Adenylyl Cyclase"
                ],
                correctAnswer: 0
            }
        ]
    };
}
