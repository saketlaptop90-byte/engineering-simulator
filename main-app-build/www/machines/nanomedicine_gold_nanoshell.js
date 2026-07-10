import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "Ultra High-Tech Gold Nanoshell for Targeted Photothermal Therapy and Drug Delivery. Features a mesoporous silica core, continuous plasmonic gold shell, PEGylated stealth coating, and specific antibody targeting ligands.";

    const meshes = {};

    // Base Nanoshell properties
    const coreRadius = 15;
    const shellRadius = 16.5;

    // Custom High-Tech Materials
    const silicaMat = new THREE.MeshPhysicalMaterial({
        color: 0xaabbff,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0.1,
        ior: 1.45,
        thickness: 2.0,
        transparent: true,
        side: THREE.DoubleSide
    });

    const goldShellMat = new THREE.MeshStandardMaterial({
        color: 0xffc000,
        emissive: 0x553300,
        emissiveIntensity: 0.4,
        metalness: 1.0,
        roughness: 0.25,
        wireframe: false,
        side: THREE.DoubleSide
    });

    const plasmonAuraMat = new THREE.MeshBasicMaterial({
        color: 0xff3300,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    });

    const pegMat = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transmission: 0.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.5
    });

    const antibodyMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x111111,
        metalness: 0.1,
        roughness: 0.8
    });

    const fluorophoreMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });

    const liposomeMat = new THREE.MeshPhysicalMaterial({
        color: 0xddddaa,
        transmission: 0.8,
        transparent: true,
        opacity: 0.4,
        roughness: 0.3,
        clearcoat: 0.5
    });

    // 1. Silica Core (Mesoporous)
    const coreGeo = new THREE.IcosahedronGeometry(coreRadius, 12);
    // Add noise to core vertices for realism
    const corePos = coreGeo.attributes.position;
    for (let i = 0; i < corePos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(corePos, i);
        v.add(v.clone().normalize().multiplyScalar(Math.random() * 0.5));
        corePos.setXYZ(i, v.x, v.y, v.z);
    }
    coreGeo.computeVertexNormals();
    const silicaCore = new THREE.Mesh(coreGeo, silicaMat);
    group.add(silicaCore);
    meshes.silicaCore = silicaCore;
    
    parts.push({
        name: 'Mesoporous Silica Core',
        description: 'Dielectric core providing structural stability and high surface area for drug loading.',
        material: 'Silica Glass',
        function: 'Tunes the optical resonance of the shell and acts as a drug reservoir.',
        assemblyOrder: 1,
        connections: ['Gold Shell', 'Encapsulated Drug Payload'],
        failureEffect: 'Loss of optical tunability, premature drug leakage.',
        cascadeFailures: ['Plasmonic detuning', 'Systemic toxicity'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -40, y: 0, z: 0}
    });

    // 2. Gold Shell
    const shellGeo = new THREE.IcosahedronGeometry(shellRadius, 16);
    // Add subtle bumpiness to shell
    const shellPos = shellGeo.attributes.position;
    for (let i = 0; i < shellPos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(shellPos, i);
        const noise = Math.sin(v.x * 2) * Math.cos(v.y * 2) * Math.sin(v.z * 2) * 0.3;
        v.add(v.clone().normalize().multiplyScalar(noise));
        shellPos.setXYZ(i, v.x, v.y, v.z);
    }
    shellGeo.computeVertexNormals();
    const goldShell = new THREE.Mesh(shellGeo, goldShellMat);
    group.add(goldShell);
    meshes.goldShell = goldShell;

    parts.push({
        name: 'Continuous Gold Shell',
        description: 'Ultra-thin gold layer precisely tuned to absorb near-infrared light.',
        material: 'Gold',
        function: 'Converts near-infrared light into extreme localized heat via LSPR.',
        assemblyOrder: 2,
        connections: ['Silica Core', 'PEG Coating'],
        failureEffect: 'Inability to generate heat, failure of photothermal therapy.',
        cascadeFailures: ['Thermosensitive liposome remains intact', 'No drug release'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 40, z: 0}
    });

    // 3. Plasmon Aura
    const auraGeo = new THREE.SphereGeometry(shellRadius * 1.15, 64, 64);
    const plasmonAura = new THREE.Mesh(auraGeo, plasmonAuraMat);
    group.add(plasmonAura);
    meshes.plasmonAura = plasmonAura;

    parts.push({
        name: 'Localized Surface Plasmon Resonance (LSPR) Field',
        description: 'Electromagnetic field generated by collective electron oscillation on the gold surface.',
        material: 'Electromagnetic Field',
        function: 'Induces rapid localized heating and enhances fluorescence of nearby molecules.',
        assemblyOrder: 3,
        connections: ['Gold Shell'],
        failureEffect: 'Lack of energy transfer to the environment.',
        cascadeFailures: ['Loss of photothermal efficacy'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 40}
    });

    // Sub-structures distribution via Fibonacci sphere
    const pegGroup = new THREE.Group();
    const antibodyGroup = new THREE.Group();
    const fluorophoreGroup = new THREE.Group();
    
    meshes.pegs = [];
    meshes.antibodies = [];
    meshes.fluorophores = [];

    const numPegs = 300;
    const numAntibodies = 40;
    const numFluors = 60;
    
    function getFibonacciSpherePoints(samples, radius, randomize = true) {
        const points = [];
        const rnd = randomize ? Math.random() * samples : 1;
        const offset = 2 / samples;
        const increment = Math.PI * (3 - Math.sqrt(5)); // Golden angle

        for (let i = 0; i < samples; i++) {
            const y = ((i * offset) - 1) + (offset / 2);
            const r = Math.sqrt(1 - Math.pow(y, 2));
            const phi = ((i + rnd) % samples) * increment;
            const x = Math.cos(phi) * r;
            const z = Math.sin(phi) * r;
            points.push(new THREE.Vector3(x * radius, y * radius, z * radius));
        }
        return points;
    }

    const pegPoints = getFibonacciSpherePoints(numPegs, shellRadius);
    const antibodyPoints = getFibonacciSpherePoints(numAntibodies, shellRadius);
    const fluorPoints = getFibonacciSpherePoints(numFluors, shellRadius);

    // 4. Create PEG Chains
    pegPoints.forEach((pt, index) => {
        const curvePoints = [];
        let currentPt = pt.clone();
        const normal = pt.clone().normalize();
        for (let j = 0; j < 5; j++) {
            curvePoints.push(currentPt.clone());
            const jitter = new THREE.Vector3(
                (Math.random() - 0.5) * 1.5,
                (Math.random() - 0.5) * 1.5,
                (Math.random() - 0.5) * 1.5
            );
            currentPt.add(normal.clone().multiplyScalar(1.2)).add(jitter);
        }
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeo = new THREE.TubeGeometry(curve, 10, 0.2, 8, false);
        const pegMesh = new THREE.Mesh(tubeGeo, pegMat);
        pegGroup.add(pegMesh);
        meshes.pegs.push({ mesh: pegMesh, curvePoints, normal });
    });
    group.add(pegGroup);

    parts.push({
        name: 'Thiol-PEG Stealth Coating',
        description: 'Polyethylene glycol chains covalently attached to the gold surface via thiol bonds.',
        material: 'Polymer (PEG)',
        function: 'Prevents opsonization and clearance by the reticuloendothelial system (RES).',
        assemblyOrder: 4,
        connections: ['Gold Shell', 'Disulfide Linkages'],
        failureEffect: 'Rapid clearance by the immune system (macrophages).',
        cascadeFailures: ['Failure to reach target tumor'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 40, y: 0, z: 0}
    });

    // 5-7. Create Antibodies
    antibodyPoints.forEach((pt) => {
        const abGroup = new THREE.Group();
        const normal = pt.clone().normalize();
        
        // Base (Fc region)
        const fcGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
        fcGeo.translate(0, 1.5, 0);
        const fc = new THREE.Mesh(fcGeo, antibodyMat);
        
        // Arms (Fab region)
        const fabGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.5, 16);
        fabGeo.translate(0, 1.25, 0);
        
        const arm1 = new THREE.Mesh(fabGeo, antibodyMat);
        arm1.position.set(0, 3, 0);
        arm1.rotation.z = Math.PI / 4;
        
        const arm2 = new THREE.Mesh(fabGeo, antibodyMat);
        arm2.position.set(0, 3, 0);
        arm2.rotation.z = -Math.PI / 4;

        abGroup.add(fc);
        abGroup.add(arm1);
        abGroup.add(arm2);
        
        // Orient antibody to point outward
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        abGroup.quaternion.copy(quaternion);
        abGroup.position.copy(pt.clone().add(normal.multiplyScalar(2)));

        antibodyGroup.add(abGroup);
        meshes.antibodies.push(abGroup);
    });
    group.add(antibodyGroup);

    parts.push({
        name: 'Anti-EGFR Antibodies',
        description: 'Monoclonal antibodies conjugated to the outer PEG layer.',
        material: 'Protein',
        function: 'Actively targets epidermal growth factor receptors overexpressed on cancer cells.',
        assemblyOrder: 5,
        connections: ['Thiol-PEG Stealth Coating'],
        failureEffect: 'Loss of active targeting capability.',
        cascadeFailures: ['Decreased tumor accumulation', 'Off-target toxicity'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -40, z: 0}
    });

    parts.push({
        name: 'Antibody Fab Region',
        description: 'Fragment antigen-binding region of the antibody.',
        material: 'Protein',
        function: 'Binds specifically to the target tumor antigen.',
        assemblyOrder: 6,
        connections: ['Anti-EGFR Antibodies'],
        failureEffect: 'No antigen recognition.',
        cascadeFailures: ['No cell uptake'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -20, y: -40, z: 0}
    });

    parts.push({
        name: 'Antibody Fc Region',
        description: 'Fragment crystallizable region forming the base of the antibody Y-shape.',
        material: 'Protein',
        function: 'Anchors the antibody to the nanoparticle surface.',
        assemblyOrder: 7,
        connections: ['Anti-EGFR Antibodies'],
        failureEffect: 'Antibody detaches from the nanoshell.',
        cascadeFailures: ['Loss of active targeting'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 20, y: -40, z: 0}
    });

    // 8. Create Fluorophores
    fluorPoints.forEach((pt) => {
        const normal = pt.clone().normalize();
        const fluoGeo = new THREE.OctahedronGeometry(0.8, 1);
        const fluoMesh = new THREE.Mesh(fluoGeo, fluorophoreMat);
        fluoMesh.position.copy(pt.clone().add(normal.multiplyScalar(1.5)));
        
        const glowGeo = new THREE.SphereGeometry(1.2, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        const glowMesh = new THREE.Mesh(glowGeo, glowMat);
        fluoMesh.add(glowMesh);

        fluorophoreGroup.add(fluoMesh);
        meshes.fluorophores.push(fluoMesh);
    });
    group.add(fluorophoreGroup);

    parts.push({
        name: 'Theranostic Fluorophores (Cy5.5)',
        description: 'Near-infrared fluorescent molecules embedded near the gold surface.',
        material: 'Organic Dye',
        function: 'Provides real-time in vivo fluorescence imaging for tracking the nanoparticles.',
        assemblyOrder: 8,
        connections: ['Gold Shell', 'PEG Coating'],
        failureEffect: 'Inability to track the nanoparticle distribution.',
        cascadeFailures: ['Blind treatment execution'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -40}
    });

    // 9-10. Internal Drug Payload (Doxorubicin molecules inside the core)
    const drugGroup = new THREE.Group();
    meshes.drugs = [];
    for (let i = 0; i < 150; i++) {
        const doxGroup = new THREE.Group();
        
        const ringGeo = new THREE.TorusGeometry(0.4, 0.15, 8, 16);
        const ringMat = new THREE.MeshPhysicalMaterial({ color: 0xff0000, metalness: 0.2, roughness: 0.1 });
        
        const ring1 = new THREE.Mesh(ringGeo, ringMat);
        const ring2 = new THREE.Mesh(ringGeo, ringMat);
        ring2.position.x = 0.8;
        const ring3 = new THREE.Mesh(ringGeo, ringMat);
        ring3.position.x = 1.6;
        
        doxGroup.add(ring1);
        doxGroup.add(ring2);
        doxGroup.add(ring3);
        
        const radius = Math.random() * (coreRadius - 2);
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        
        doxGroup.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        
        doxGroup.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        
        drugGroup.add(doxGroup);
        meshes.drugs.push(doxGroup);
    }
    group.add(drugGroup);

    parts.push({
        name: 'Encapsulated Doxorubicin',
        description: 'Chemotherapeutic drug loaded into the mesopores of the silica core.',
        material: 'Chemical Compound',
        function: 'Destroys cancer cell DNA upon targeted release.',
        assemblyOrder: 9,
        connections: ['Mesoporous Silica Core'],
        failureEffect: 'Lack of chemical cytotoxicity.',
        cascadeFailures: ['Incomplete tumor eradication'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -25, y: 25, z: -25}
    });

    parts.push({
        name: 'Mesoporous Channels',
        description: 'Nanoscale pores penetrating the silica matrix.',
        material: 'Void Space',
        function: 'Maximizes internal volume for high-capacity drug loading.',
        assemblyOrder: 10,
        connections: ['Mesoporous Silica Core'],
        failureEffect: 'Low drug loading capacity.',
        cascadeFailures: ['Insufficient dose delivered to tumor'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -15, y: 15, z: -15}
    });

    // 11. Outer Liposome Layer (Thermosensitive)
    const lipoGeo = new THREE.SphereGeometry(shellRadius + 3.5, 64, 64);
    const liposomeMesh = new THREE.Mesh(lipoGeo, liposomeMat);
    group.add(liposomeMesh);
    meshes.liposome = liposomeMesh;

    parts.push({
        name: 'Thermosensitive Liposome Coating',
        description: 'Lipid bilayer encapsulating the entire nanoshell structure, designed to melt at 42°C.',
        material: 'Lipid Bilayer',
        function: 'Traps the drug inside until photothermal heating triggers a phase transition, releasing the payload.',
        assemblyOrder: 11,
        connections: ['Gold Shell', 'Thiol-PEG Stealth Coating'],
        failureEffect: 'Premature drug release in the bloodstream.',
        cascadeFailures: ['Systemic toxicity', 'No drug at target site'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 25, y: 25, z: 25}
    });

    // 12. Plasmon Hotspot Clusters
    const hotspotGroup = new THREE.Group();
    for (let i = 0; i < 50; i++) {
        const spikeGeo = new THREE.ConeGeometry(0.3, 1.5, 8);
        const spikeMesh = new THREE.Mesh(spikeGeo, goldShellMat);
        
        const pt = getFibonacciSpherePoints(50, shellRadius)[i];
        const normal = pt.clone().normalize();
        
        spikeMesh.position.copy(pt);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        spikeMesh.quaternion.copy(quaternion);
        
        hotspotGroup.add(spikeMesh);
    }
    group.add(hotspotGroup);

    parts.push({
        name: 'Plasmon Hotspot Clusters',
        description: 'Nanoscale gold spikes and aggregates on the shell surface.',
        material: 'Gold',
        function: 'Concentrates the electromagnetic field to create intense localized heating points.',
        assemblyOrder: 12,
        connections: ['Continuous Gold Shell'],
        failureEffect: 'Reduced heating efficiency.',
        cascadeFailures: ['Inability to melt liposome coating'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 15, y: 50, z: -15}
    });

    // 13. Disulfide Linkages
    const disulfideGroup = new THREE.Group();
    pegPoints.forEach((pt) => {
        const normal = pt.clone().normalize();
        const bondGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
        const bondMat = new THREE.MeshStandardMaterial({ color: 0xaaaa00, metalness: 0.8, roughness: 0.2 });
        const bond = new THREE.Mesh(bondGeo, bondMat);
        
        bond.position.copy(pt.clone().add(normal.multiplyScalar(0.3)));
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        bond.quaternion.copy(quaternion);
        
        disulfideGroup.add(bond);
    });
    group.add(disulfideGroup);

    parts.push({
        name: 'Disulfide Linkages',
        description: 'Covalent sulfur-sulfur bonds anchoring the PEG chains to the gold surface.',
        material: 'Sulfur Compound',
        function: 'Provides a robust chemical attachment that is stable in blood but cleavable in the reducing tumor microenvironment.',
        assemblyOrder: 13,
        connections: ['Gold Shell', 'Thiol-PEG Stealth Coating'],
        failureEffect: 'Detachment of the stealth coating.',
        cascadeFailures: ['Immune clearance'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 45, y: 15, z: 15}
    });

    // 14. Penetration Peptides (TAT Peptides)
    const tatGroup = new THREE.Group();
    meshes.tatPeptides = [];
    const tatPoints = getFibonacciSpherePoints(80, shellRadius);
    tatPoints.forEach((pt) => {
        const normal = pt.clone().normalize();
        
        const helixPoints = [];
        for(let i=0; i<=20; i++) {
            const t = i / 20;
            const radius = 0.2;
            const angle = t * Math.PI * 6; // 3 turns
            const hx = Math.cos(angle) * radius;
            const hz = Math.sin(angle) * radius;
            const hy = t * 2;
            helixPoints.push(new THREE.Vector3(hx, hy, hz));
        }
        const helixCurve = new THREE.CatmullRomCurve3(helixPoints);
        const helixGeo = new THREE.TubeGeometry(helixCurve, 32, 0.05, 8, false);
        const helixMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, roughness: 0.4 });
        
        const helix = new THREE.Mesh(helixGeo, helixMat);
        helix.position.copy(pt.clone().add(normal.multiplyScalar(1)));
        
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        helix.quaternion.copy(quaternion);
        
        tatGroup.add(helix);
        meshes.tatPeptides.push(helix);
    });
    group.add(tatGroup);

    parts.push({
        name: 'TAT Penetration Peptides',
        description: 'Cell-penetrating peptides derived from HIV-1 TAT protein.',
        material: 'Peptide Sequence',
        function: 'Facilitates translocation of the nanoshell across the target cell membrane into the cytoplasm.',
        assemblyOrder: 14,
        connections: ['Thiol-PEG Stealth Coating'],
        failureEffect: 'Inability to enter the cancer cell.',
        cascadeFailures: ['Extracellular drug release', 'Reduced efficacy'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -35, y: -25, z: 25}
    });

    // 15. Target Cell Membrane Receptors
    const receptorGroup = new THREE.Group();
    meshes.receptors = [];
    for(let i=0; i<10; i++) {
        const recGeo = new THREE.TorusKnotGeometry(1.5, 0.4, 64, 16);
        const recMat = new THREE.MeshPhysicalMaterial({ color: 0x4444ff, transmission: 0.5, opacity: 0.8, transparent: true });
        const rec = new THREE.Mesh(recGeo, recMat);
        
        const ab = antibodyGroup.children[i];
        if (ab) {
            rec.position.copy(ab.position.clone().multiplyScalar(1.2));
            rec.rotation.set(Math.random(), Math.random(), Math.random());
            receptorGroup.add(rec);
            meshes.receptors.push({ mesh: rec, basePos: rec.position.clone() });
        }
    }
    group.add(receptorGroup);

    parts.push({
        name: 'Target Cell Membrane Receptors',
        description: 'EGFR receptors localized on the surface of the cancer cell.',
        material: 'Cellular Glycoprotein',
        function: 'Acts as the specific docking site for the nanoshell antibodies.',
        assemblyOrder: 15,
        connections: ['Anti-EGFR Antibodies'],
        failureEffect: 'No binding interaction.',
        cascadeFailures: ['Nanoshell washes away from tumor site'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -60, z: 0}
    });

    // 16. Endosomal Escape Polymers
    const endoGroup = new THREE.Group();
    const endoPoints = getFibonacciSpherePoints(40, shellRadius);
    endoPoints.forEach((pt) => {
        const normal = pt.clone().normalize();
        const endoGeo = new THREE.TetrahedronGeometry(0.5);
        const endoMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, metalness: 0.5 });
        const endo = new THREE.Mesh(endoGeo, endoMat);
        
        endo.position.copy(pt.clone().add(normal.multiplyScalar(0.5)));
        endoGroup.add(endo);
    });
    group.add(endoGroup);

    parts.push({
        name: 'Endosomal Escape Polymers (PEI)',
        description: 'Polyethylenimine structures grafted onto the surface.',
        material: 'Polymer (PEI)',
        function: 'Induces the proton sponge effect to rupture endosomes and release the nanoshell into the cytosol.',
        assemblyOrder: 16,
        connections: ['Continuous Gold Shell'],
        failureEffect: 'Nanoshell trapped and degraded in lysosomes.',
        cascadeFailures: ['Destruction of drug payload'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -30, y: -30, z: -30}
    });

    // Quiz Questions
    const quizQuestions = [
        {
            question: "What is the primary function of the localized surface plasmon resonance (LSPR) in the gold shell?",
            options: [
                "To make the nanoparticle invisible to the immune system.",
                "To convert near-infrared light into intense localized heat.",
                "To chemically bind with the target cell DNA.",
                "To dissolve the silica core upon entry into the cell."
            ],
            correctAnswer: 1,
            explanation: "LSPR occurs when light interacts with conduction electrons on the gold shell, causing them to oscillate and generate extreme localized heat, which is the basis for photothermal therapy."
        },
        {
            question: "Why is Polyethylene Glycol (PEG) used as a stealth coating on the nanoshell?",
            options: [
                "It absorbs light to enhance the plasmonic effect.",
                "It acts as the primary cytotoxic drug killing the cancer cell.",
                "It prevents opsonization and macrophage clearance, prolonging circulation time.",
                "It specifically targets the EGFR receptors on cancer cells."
            ],
            correctAnswer: 2,
            explanation: "PEGylation creates a hydrophilic layer that hides the nanoparticle from the immune system, preventing rapid clearance by the reticuloendothelial system."
        },
        {
            question: "What triggers the release of the encapsulated Doxorubicin from the mesoporous silica core?",
            options: [
                "Exposure to near-infrared light which melts the thermosensitive liposome coating.",
                "Binding of the anti-EGFR antibodies to the cell surface.",
                "The proton sponge effect caused by PEI.",
                "Spontaneous degradation of the gold shell in the bloodstream."
            ],
            correctAnswer: 0,
            explanation: "The localized heat generated by the gold shell upon near-infrared irradiation raises the temperature above 42°C, causing the thermosensitive liposome lipid bilayer to undergo a phase transition and release the drug."
        },
        {
            question: "What role do the TAT penetration peptides play in the nanoshell's function?",
            options: [
                "They anchor the PEG chains to the gold shell.",
                "They facilitate the translocation of the nanoshell across the target cell membrane.",
                "They generate fluorescence for real-time tracking.",
                "They prevent the nanoshell from aggregating in the bloodstream."
            ],
            correctAnswer: 1,
            explanation: "TAT peptides are cell-penetrating peptides that help the nanoshell cross the hydrophobic cellular membrane to enter the cytoplasm."
        },
        {
            question: "Which component is responsible for the 'proton sponge effect' to prevent lysosomal degradation?",
            options: [
                "Thermosensitive Liposome Coating",
                "Disulfide Linkages",
                "Endosomal Escape Polymers (PEI)",
                "Anti-EGFR Antibodies"
            ],
            correctAnswer: 2,
            explanation: "Polyethylenimine (PEI) absorbs protons in the acidic endosome environment, leading to an influx of chloride ions and water, causing the endosome to swell and rupture (the proton sponge effect)."
        }
    ];

    // Animation Function
    let clock = 0;
    
    function animate(time, speed, meshesArray) {
        clock += speed * 0.01;

        // 1. Pulsate Plasmon Aura (LSPR Effect)
        if (meshes.plasmonAura) {
            const scale = 1.0 + Math.sin(clock * 5) * 0.03;
            meshes.plasmonAura.scale.set(scale, scale, scale);
            meshes.plasmonAura.material.opacity = 0.2 + Math.sin(clock * 10) * 0.1;
        }

        // 2. Wiggle PEG Chains (Brownian motion in fluid)
        if (meshes.pegs && meshes.pegs.length > 0) {
            meshes.pegs.forEach((pegObj, index) => {
                const mesh = pegObj.mesh;
                mesh.rotation.x = Math.sin(clock * 2 + index) * 0.05;
                mesh.rotation.y = Math.cos(clock * 2 + index) * 0.05;
            });
        }

        // 3. Rotate and bob internal drugs (Simulating thermal motion inside mesopores)
        if (meshes.drugs && meshes.drugs.length > 0) {
            meshes.drugs.forEach((drug, index) => {
                drug.rotation.x += 0.02 * speed;
                drug.rotation.y += 0.015 * speed;
                
                const drift = Math.sin(clock * 0.5 + index) * 0.02;
                drug.position.y += drift;
            });
        }

        // 4. Fluorophore pulsing
        if (meshes.fluorophores && meshes.fluorophores.length > 0) {
            meshes.fluorophores.forEach((fluo, index) => {
                fluo.material.emissiveIntensity = 1.0 + Math.sin(clock * 8 + index) * 1.5;
                fluo.rotation.y += 0.05 * speed;
            });
        }

        // 5. Liposome fluidic shifting (noise effect via scale)
        if (meshes.liposome) {
            const lScaleX = 1.0 + Math.sin(clock * 1.5) * 0.015;
            const lScaleY = 1.0 + Math.cos(clock * 1.2) * 0.015;
            const lScaleZ = 1.0 + Math.sin(clock * 1.7) * 0.015;
            meshes.liposome.scale.set(lScaleX, lScaleY, lScaleZ);
        }

        // 6. Receptor docking interaction (approaching and binding motion)
        if (meshes.receptors && meshes.receptors.length > 0) {
            meshes.receptors.forEach((recObj, index) => {
                const mesh = recObj.mesh;
                const base = recObj.basePos;
                
                const dockDistance = Math.sin(clock * 0.5 + index) * 1.5; 
                mesh.position.copy(base.clone().add(base.clone().normalize().multiplyScalar(dockDistance)));
                
                mesh.rotation.x += 0.01 * speed;
                mesh.rotation.y += 0.02 * speed;
            });
        }

        // 7. TAT Peptides corkscrew rotation
        if (meshes.tatPeptides && meshes.tatPeptides.length > 0) {
            meshes.tatPeptides.forEach((tat, index) => {
                tat.rotateY(0.05 * speed);
            });
        }
        
        // 8. Overall global slow rotation
        group.rotation.y = clock * 0.2;
        group.rotation.z = Math.sin(clock * 0.1) * 0.1;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createGoldNanoshell() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
