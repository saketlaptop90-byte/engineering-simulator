import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = 'TargetedExosome';

    const parts = [];
    const meshes = {};

    // Helper to generate complex custom emissive materials
    function createGlowingMaterial(colorHex, intensity) {
        return new THREE.MeshStandardMaterial({
            color: colorHex,
            emissive: colorHex,
            emissiveIntensity: intensity,
            roughness: 0.2,
            metalness: 0.8,
            transparent: true,
            opacity: 0.9
        });
    }

    const bioNeonCyan = createGlowingMaterial(0x00ffff, 1.5);
    const bioNeonMagenta = createGlowingMaterial(0xff00ff, 1.2);
    const bioNeonGreen = createGlowingMaterial(0x00ff00, 1.0);
    const bioNeonOrange = createGlowingMaterial(0xffa500, 1.5);
    const RNAColor = createGlowingMaterial(0xff3333, 2.0);

    // ==========================================
    // 1. Vesicle Membrane (Outer & Inner)
    // ==========================================
    const membraneRadius = 25;
    
    // Outer Membrane
    const outerMembraneGeo = new THREE.IcosahedronGeometry(membraneRadius, 8); // High detail
    const outerMembraneMat = glass.clone();
    outerMembraneMat.color = new THREE.Color(0x3366ff);
    outerMembraneMat.transparent = true;
    outerMembraneMat.opacity = 0.2;
    outerMembraneMat.side = THREE.DoubleSide;
    const outerMembrane = new THREE.Mesh(outerMembraneGeo, outerMembraneMat);
    outerMembrane.name = 'outer_membrane';
    group.add(outerMembrane);
    meshes.outerMembrane = outerMembrane;

    parts.push({
        name: 'Outer Lipid Bilayer',
        description: 'Engineered outer leaflet of the exosome membrane composed of synthetic and natural lipids optimized for circulation.',
        material: 'Glass / Custom Transparent',
        function: 'Protects the internal cargo and provides a scaffold for surface proteins.',
        assemblyOrder: 1,
        connections: ['Inner Membrane', 'Surface Receptors'],
        failureEffect: 'Loss of exosome integrity, leading to premature cargo release in the bloodstream.',
        cascadeFailures: ['Cargo degradation', 'Loss of targeting efficacy'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // Inner Membrane
    const innerMembraneGeo = new THREE.IcosahedronGeometry(membraneRadius - 1.5, 7);
    const innerMembraneMat = tinted.clone();
    innerMembraneMat.color = new THREE.Color(0x112266);
    innerMembraneMat.transparent = true;
    innerMembraneMat.opacity = 0.15;
    const innerMembrane = new THREE.Mesh(innerMembraneGeo, innerMembraneMat);
    innerMembrane.name = 'inner_membrane';
    group.add(innerMembrane);
    meshes.innerMembrane = innerMembrane;

    parts.push({
        name: 'Inner Lipid Bilayer',
        description: 'The internal leaflet of the lipid bilayer, interacting closely with the aqueous core and scaffolding proteins.',
        material: 'Tinted Glass',
        function: 'Maintains the spherical shape and hosts transmembrane protein anchors.',
        assemblyOrder: 2,
        connections: ['Outer Membrane', 'Aqueous Core'],
        failureEffect: 'Internal membrane collapse and leakage of aqueous contents.',
        cascadeFailures: ['Cytosolic disruption', 'Enzyme degradation'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });

    // ==========================================
    // 2. Aqueous Core (Emissive Center)
    // ==========================================
    const coreGeo = new THREE.SphereGeometry(membraneRadius - 3, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0x002244,
        emissive: 0x001133,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.05,
        wireframe: true
    });
    const aqueousCore = new THREE.Mesh(coreGeo, coreMat);
    group.add(aqueousCore);
    meshes.aqueousCore = aqueousCore;

    parts.push({
        name: 'Aqueous Core Matrix',
        description: 'The internal fluid environment formulated to stabilize delicate RNA and protein therapeutics.',
        material: 'Holographic Wireframe / Emissive',
        function: 'Suspends internal cargo in an optimal pH and ionic environment.',
        assemblyOrder: 3,
        connections: ['RNA Cargo', 'Protein Therapeutics'],
        failureEffect: 'Precipitation or denaturation of internal cargo.',
        cascadeFailures: ['Loss of therapeutic efficacy'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -50 }
    });

    // ==========================================
    // 3. Target Receptors (Ligands)
    // ==========================================
    const receptorGroup = new THREE.Group();
    const numReceptors = 150;
    const receptorGeo = new THREE.CylinderGeometry(0.2, 0.5, 4, 8);
    const receptorHeadGeo = new THREE.OctahedronGeometry(1.2, 2);
    
    // We will place them using Fibonacci sphere distribution for even spacing
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < numReceptors; i++) {
        const y = 1 - (i / (numReceptors - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;

        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;

        const pos = new THREE.Vector3(x, y, z).multiplyScalar(membraneRadius);
        
        const recMesh = new THREE.Group();
        
        const stem = new THREE.Mesh(receptorGeo, chrome);
        stem.position.y = 2;
        
        const head = new THREE.Mesh(receptorHeadGeo, bioNeonCyan);
        head.position.y = 4.5;
        
        recMesh.add(stem);
        recMesh.add(head);
        
        recMesh.position.copy(pos);
        // Align to normal
        recMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
        
        receptorGroup.add(recMesh);
    }
    group.add(receptorGroup);
    meshes.receptorGroup = receptorGroup;

    parts.push({
        name: 'Targeting Receptors (Ligands)',
        description: 'Engineered synthetic peptides projecting from the exosome surface.',
        material: 'Chrome / Neon Cyan',
        function: 'Binds specifically to disease-associated cellular markers for precise targeting.',
        assemblyOrder: 4,
        connections: ['Outer Membrane'],
        failureEffect: 'Off-target binding leading to toxicity in healthy tissues.',
        cascadeFailures: ['Ineffective dose at target site', 'Systemic side effects'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 50, y: 50, z: 50 }
    });

    // ==========================================
    // 4. CD47 "Don't Eat Me" Markers
    // ==========================================
    const cd47Group = new THREE.Group();
    const numCD47 = 80;
    const cd47BaseGeo = new THREE.TorusGeometry(0.8, 0.3, 8, 16);
    const cd47SpikeGeo = new THREE.ConeGeometry(0.4, 2, 8);

    for (let i = 0; i < numCD47; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phiAngle = Math.acos(2 * v - 1);
        
        const pos = new THREE.Vector3(
            Math.sin(phiAngle) * Math.cos(theta),
            Math.sin(phiAngle) * Math.sin(theta),
            Math.cos(phiAngle)
        ).multiplyScalar(membraneRadius);

        const marker = new THREE.Group();
        
        const base = new THREE.Mesh(cd47BaseGeo, copper);
        base.rotation.x = Math.PI / 2;
        
        const spike = new THREE.Mesh(cd47SpikeGeo, bioNeonOrange);
        spike.position.y = 1;
        
        marker.add(base);
        marker.add(spike);
        
        marker.position.copy(pos);
        marker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
        
        cd47Group.add(marker);
    }
    group.add(cd47Group);
    meshes.cd47Group = cd47Group;

    parts.push({
        name: 'CD47 Stealth Markers',
        description: 'Recombinant CD47 proteins embedded in the membrane to evade macrophage clearance.',
        material: 'Copper / Neon Orange',
        function: 'Sends an inhibitory signal to macrophages to prevent phagocytosis, increasing circulation half-life.',
        assemblyOrder: 5,
        connections: ['Outer Membrane'],
        failureEffect: 'Rapid clearance by the mononuclear phagocyte system.',
        cascadeFailures: ['Complete loss of therapeutic payload before reaching target'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -50, y: -50, z: -50 }
    });

    // ==========================================
    // 5. Transmembrane Channels (Pores)
    // ==========================================
    const channelsGroup = new THREE.Group();
    const channelGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 16, 1, true); // Hollow
    const channelInnerGeo = new THREE.CylinderGeometry(1.2, 1.2, 4, 16, 1, false);

    for(let i=0; i<30; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phiAngle = Math.acos(2 * v - 1);
        
        const pos = new THREE.Vector3(
            Math.sin(phiAngle) * Math.cos(theta),
            Math.sin(phiAngle) * Math.sin(theta),
            Math.cos(phiAngle)
        ).multiplyScalar(membraneRadius);

        const channel = new THREE.Group();
        const outer = new THREE.Mesh(channelGeo, steel);
        const inner = new THREE.Mesh(channelInnerGeo, bioNeonMagenta);
        inner.scale.set(0.9, 1.1, 0.9);

        channel.add(outer);
        channel.add(inner);
        
        channel.position.copy(pos);
        channel.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());

        channelsGroup.add(channel);
    }
    group.add(channelsGroup);
    meshes.channelsGroup = channelsGroup;

    parts.push({
        name: 'Transmembrane Pores',
        description: 'Hexameric protein channels spanning the lipid bilayer.',
        material: 'Steel / Neon Magenta',
        function: 'Regulates ionic balance and enables controlled release of small molecular payloads.',
        assemblyOrder: 6,
        connections: ['Outer Membrane', 'Inner Membrane'],
        failureEffect: 'Osmotic imbalance leading to exosome rupture.',
        cascadeFailures: ['Catastrophic structural failure', 'Premature cargo dump'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 60 }
    });

    // ==========================================
    // 6. PEG Polymer Chains (Corona)
    // ==========================================
    const pegGroup = new THREE.Group();
    const pegCurvePoints = [];
    for (let j = 0; j < 10; j++) {
        pegCurvePoints.push(new THREE.Vector3(
            Math.sin(j * 0.5) * 1.5,
            j * 1.2,
            Math.cos(j * 0.5) * 1.5
        ));
    }
    const pegCurve = new THREE.CatmullRomCurve3(pegCurvePoints);
    const pegGeo = new THREE.TubeGeometry(pegCurve, 20, 0.15, 8, false);

    for(let i=0; i<200; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phiAngle = Math.acos(2 * v - 1);
        
        const pos = new THREE.Vector3(
            Math.sin(phiAngle) * Math.cos(theta),
            Math.sin(phiAngle) * Math.sin(theta),
            Math.cos(phiAngle)
        ).multiplyScalar(membraneRadius);

        const pegMesh = new THREE.Mesh(pegGeo, plastic);
        pegMesh.position.copy(pos);
        pegMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
        
        // Randomize rotation slightly for organic feel
        pegMesh.rotateY(Math.random() * Math.PI);
        pegMesh.rotateX((Math.random() - 0.5) * 0.5);

        pegGroup.add(pegMesh);
    }
    group.add(pegGroup);
    meshes.pegGroup = pegGroup;

    parts.push({
        name: 'PEG Polymer Corona',
        description: 'Polyethylene glycol chains covalently attached to surface lipids.',
        material: 'Plastic',
        function: 'Provides steric hindrance, masking the exosome from immune surveillance.',
        assemblyOrder: 7,
        connections: ['Outer Membrane'],
        failureEffect: 'Increased immunogenicity and rapid opsonization.',
        cascadeFailures: ['Immune clearance'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 60, y: 0, z: 0 }
    });

    // ==========================================
    // 7. Core Cargo: Therapeutic mRNA Strands
    // ==========================================
    const rnaGroup = new THREE.Group();
    meshes.rnaStrands = [];

    // Create a complex double-helix-like or single-stranded complex structure
    function createRNAStrand(radius, height, turns, colorMat) {
        const strandGroup = new THREE.Group();
        const pathPoints = [];
        const numPoints = 100;
        
        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
            const angle = t * Math.PI * 2 * turns;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (t - 0.5) * height;
            pathPoints.push(new THREE.Vector3(x, y, z));
        }

        const curve = new THREE.CatmullRomCurve3(pathPoints);
        const tubeGeo = new THREE.TubeGeometry(curve, 100, 0.4, 8, false);
        const strand = new THREE.Mesh(tubeGeo, colorMat);
        strandGroup.add(strand);

        // Add nucleobases
        const baseGeo = new THREE.CylinderGeometry(0.1, 0.1, radius, 8);
        for (let i = 0; i <= numPoints; i+=2) {
            const t = i / numPoints;
            const angle = t * Math.PI * 2 * turns;
            const x = Math.cos(angle) * (radius / 2);
            const z = Math.sin(angle) * (radius / 2);
            const y = (t - 0.5) * height;

            const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
            baseMesh.position.set(x, y, z);
            baseMesh.rotation.y = -angle;
            baseMesh.rotation.z = Math.PI / 2;
            strandGroup.add(baseMesh);
        }

        return strandGroup;
    }

    for (let i = 0; i < 5; i++) {
        const strand = createRNAStrand(3, 15, 4, RNAColor);
        strand.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
        );
        strand.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rnaGroup.add(strand);
        meshes.rnaStrands.push({ mesh: strand, speedX: Math.random() * 0.02, speedY: Math.random() * 0.02 });
    }
    group.add(rnaGroup);

    parts.push({
        name: 'Therapeutic mRNA Payload',
        description: 'Engineered messenger RNA strands encoding therapeutic proteins.',
        material: 'Emissive Red / Dark Steel',
        function: 'Instructs target cells to synthesize specific therapeutic or apoptotic proteins.',
        assemblyOrder: 8,
        connections: ['Aqueous Core Matrix', 'Scaffolding Proteins'],
        failureEffect: 'RNA degradation by nucleases, abolishing therapeutic effect.',
        cascadeFailures: ['Treatment failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } // Remains in center during basic explode
    });

    // ==========================================
    // 8. Folded Protein Therapeutics
    // ==========================================
    const proteinGroup = new THREE.Group();
    meshes.proteins = [];
    
    // Complex TorusKnot to simulate folded proteins
    const proteinGeo = new THREE.TorusKnotGeometry(2, 0.6, 64, 16, 3, 5);
    const proteinMat = rubber.clone();
    proteinMat.color = new THREE.Color(0x8833cc);
    
    for (let i = 0; i < 8; i++) {
        const prot = new THREE.Mesh(proteinGeo, proteinMat);
        prot.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        );
        // Ensure they stay within membrane
        if (prot.position.length() > membraneRadius - 5) {
            prot.position.normalize().multiplyScalar(membraneRadius - 5);
        }
        proteinGroup.add(prot);
        meshes.proteins.push({ mesh: prot, speedZ: (Math.random() - 0.5) * 0.05 });
    }
    group.add(proteinGroup);

    parts.push({
        name: 'Folded Protein Cargo',
        description: 'Pre-folded active enzymes and functional proteins packaged within the exosome.',
        material: 'Rubber (Purple)',
        function: 'Provides immediate intracellular enzymatic activity upon vesicle fusion.',
        assemblyOrder: 9,
        connections: ['Aqueous Core Matrix'],
        failureEffect: 'Protein misfolding or aggregation inside the exosome.',
        cascadeFailures: ['Loss of immediate therapeutic response'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 40, y: -40, z: 20 }
    });

    // ==========================================
    // 9. Fusion Machinery Complex
    // ==========================================
    const fusionGroup = new THREE.Group();
    // A highly detailed mechanized-biological complex located at the poles
    const pole1 = new THREE.Vector3(0, membraneRadius - 1, 0);
    const pole2 = new THREE.Vector3(0, -(membraneRadius - 1), 0);

    function createFusionComplex() {
        const comp = new THREE.Group();
        const baseGeo = new THREE.CylinderGeometry(4, 4, 1, 16);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        
        const spikeGeo = new THREE.ConeGeometry(0.5, 4, 16);
        for(let i=0; i<6; i++) {
            const spike = new THREE.Mesh(spikeGeo, bioNeonGreen);
            const angle = (i / 6) * Math.PI * 2;
            spike.position.set(Math.cos(angle) * 3, 2, Math.sin(angle) * 3);
            spike.rotation.x = Math.PI/6;
            spike.rotation.z = -Math.cos(angle) * 0.5;
            spike.rotation.x = -Math.sin(angle) * 0.5; // Tilt outwards slightly
            comp.add(spike);
        }
        
        const coreGeo = new THREE.SphereGeometry(2, 16, 16);
        const core = new THREE.Mesh(coreGeo, aluminum);
        core.position.y = 1;
        
        comp.add(base);
        comp.add(core);
        return comp;
    }

    const fusionComplex1 = createFusionComplex();
    fusionComplex1.position.copy(pole1);
    const fusionComplex2 = createFusionComplex();
    fusionComplex2.position.copy(pole2);
    fusionComplex2.rotation.x = Math.PI;

    fusionGroup.add(fusionComplex1);
    fusionGroup.add(fusionComplex2);
    group.add(fusionGroup);
    meshes.fusionGroup = fusionGroup;

    parts.push({
        name: 'Membrane Fusion Machinery',
        description: 'Specialized SNARE-like protein complexes clustered at the exosome poles.',
        material: 'Dark Steel / Neon Green / Aluminum',
        function: 'Catalyzes the fusion of the exosome membrane with the target cell endosomal membrane.',
        assemblyOrder: 10,
        connections: ['Outer Membrane', 'Inner Membrane'],
        failureEffect: 'Inability to fuse with target cell, trapping cargo in endosomes.',
        cascadeFailures: ['Endosomal degradation of entire exosome and cargo'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 70, z: 0 }
    });

    // ==========================================
    // 10. Cholesterol Lipid Rafts
    // ==========================================
    const raftsGroup = new THREE.Group();
    const raftGeo = new THREE.CylinderGeometry(2, 2, 0.5, 12);
    
    for (let i = 0; i < 40; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phiAngle = Math.acos(2 * v - 1);
        
        const pos = new THREE.Vector3(
            Math.sin(phiAngle) * Math.cos(theta),
            Math.sin(phiAngle) * Math.sin(theta),
            Math.cos(phiAngle)
        ).multiplyScalar(membraneRadius - 0.25);

        const raft = new THREE.Mesh(raftGeo, glass); // Using glass to look crystalline
        raft.material.color = new THREE.Color(0xffffcc);
        raft.material.opacity = 0.6;
        
        raft.position.copy(pos);
        raft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
        
        raftsGroup.add(raft);
    }
    group.add(raftsGroup);

    parts.push({
        name: 'Cholesterol Lipid Rafts',
        description: 'Microdomains of tightly packed cholesterol and sphingolipids.',
        material: 'Translucent Crystalline (Yellowish Glass)',
        function: 'Provides structural rigidity and anchors heavy surface protein complexes.',
        assemblyOrder: 11,
        connections: ['Outer Membrane', 'Fusion Machinery'],
        failureEffect: 'Membrane instability and premature vesicle rupture under sheer stress.',
        cascadeFailures: ['Membrane fragmentation', 'Loss of receptors'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -40, y: 40, z: 40 }
    });

    // ==========================================
    // 11. Enzymatic Payload (Glowing particles)
    // ==========================================
    const enzymeGroup = new THREE.Group();
    meshes.enzymes = [];
    const enzymeGeo = new THREE.DodecahedronGeometry(0.8);
    
    for (let i = 0; i < 50; i++) {
        const enzyme = new THREE.Mesh(enzymeGeo, bioNeonCyan);
        // Distribute within core
        const r = Math.pow(Math.random(), 1/3) * (membraneRadius - 5);
        const theta = Math.random() * 2 * Math.PI;
        const phiAngle = Math.acos(2 * Math.random() - 1);
        
        enzyme.position.set(
            r * Math.sin(phiAngle) * Math.cos(theta),
            r * Math.sin(phiAngle) * Math.sin(theta),
            r * Math.cos(phiAngle)
        );
        
        enzymeGroup.add(enzyme);
        meshes.enzymes.push({
            mesh: enzyme,
            axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
            speed: 0.01 + Math.random() * 0.03
        });
    }
    group.add(enzymeGroup);

    parts.push({
        name: 'Enzymatic Nanocatalysts',
        description: 'Small encapsulated enzymes acting as secondary functional payloads.',
        material: 'Neon Cyan (Glowing)',
        function: 'Triggers local biochemical cascades inside the target cell cytoplasm immediately after fusion.',
        assemblyOrder: 12,
        connections: ['Aqueous Core Matrix'],
        failureEffect: 'Incomplete therapeutic response due to lack of catalytic amplifiers.',
        cascadeFailures: ['Reduced efficacy'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 50, y: -50, z: -50 }
    });

    // ==========================================
    // 12. Endosomal Escape Factors
    // ==========================================
    const escapeFactorsGroup = new THREE.Group();
    const escapeGeo = new THREE.ConeGeometry(0.5, 2.5, 4);
    
    for (let i = 0; i < 20; i++) {
        const escapeMesh = new THREE.Mesh(escapeGeo, bioNeonOrange);
        // Bound to inner membrane
        const pos = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        ).normalize().multiplyScalar(membraneRadius - 1.5);
        
        escapeMesh.position.copy(pos);
        // Point inwards
        escapeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize().negate());
        escapeFactorsGroup.add(escapeMesh);
    }
    group.add(escapeFactorsGroup);
    meshes.escapeFactorsGroup = escapeFactorsGroup;

    parts.push({
        name: 'Endosomal Escape Factors',
        description: 'pH-sensitive conformational proteins anchored to the inner membrane.',
        material: 'Neon Orange (Pyramidal structures)',
        function: 'Changes shape in acidic endosomes to rupture the endosomal membrane, ensuring cargo reaches the cytoplasm.',
        assemblyOrder: 13,
        connections: ['Inner Membrane'],
        failureEffect: 'Exosome remains trapped in endosome and is degraded by lysosomes.',
        cascadeFailures: ['Complete destruction of therapeutic payload'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -60, y: 0, z: -60 }
    });

    // ==========================================
    // 13. Exosome Structural Ribs (Cytoskeleton)
    // ==========================================
    const skeletonGroup = new THREE.Group();
    const skeletonGeo = new THREE.IcosahedronGeometry(membraneRadius - 0.5, 2);
    const skeletonEdges = new THREE.EdgesGeometry(skeletonGeo);
    const skeletonMat = new THREE.LineBasicMaterial({ color: 0x555555, linewidth: 2 });
    const skeleton = new THREE.LineSegments(skeletonEdges, skeletonMat);
    skeletonGroup.add(skeleton);
    group.add(skeletonGroup);
    meshes.skeleton = skeleton;

    parts.push({
        name: 'Internal Protein Scaffolding',
        description: 'A geodesic network of structural proteins (like actin/spectrin) supporting the membrane.',
        material: 'Dark Grey Lines (Structural network)',
        function: 'Prevents the exosome from collapsing under high shear stress in the bloodstream.',
        assemblyOrder: 14,
        connections: ['Inner Membrane', 'Cholesterol Lipid Rafts'],
        failureEffect: 'Shear-induced fragmentation of the vesicle in narrow capillaries.',
        cascadeFailures: ['Exosome lysis', 'Cargo loss in circulation'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -70 }
    });

    // ==========================================
    // 14. Tetraspanin Clusters (CD63/CD81)
    // ==========================================
    const tetraspaninGroup = new THREE.Group();
    const tetraGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const tetraMat = chrome.clone();
    tetraMat.color = new THREE.Color(0x77aaff);

    for (let i = 0; i < 60; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phiAngle = Math.acos(2 * v - 1);
        
        const pos = new THREE.Vector3(
            Math.sin(phiAngle) * Math.cos(theta),
            Math.sin(phiAngle) * Math.sin(theta),
            Math.cos(phiAngle)
        ).multiplyScalar(membraneRadius);

        const tetra = new THREE.Mesh(tetraGeo, tetraMat);
        tetra.position.copy(pos);
        tetra.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
        // Add some chaotic rotation
        tetra.rotation.y = Math.random() * Math.PI;
        
        tetraspaninGroup.add(tetra);
    }
    group.add(tetraspaninGroup);

    parts.push({
        name: 'Tetraspanin Transmembrane Clusters (CD63/CD81)',
        description: 'Complex four-pass transmembrane proteins highly enriched in exosomes.',
        material: 'Blue-tinted Chrome',
        function: 'Organizes membrane microdomains and acts as secondary docking sites for target cells.',
        assemblyOrder: 15,
        connections: ['Outer Membrane', 'Inner Membrane'],
        failureEffect: 'Disorganized membrane structure and reduced targeting efficiency.',
        cascadeFailures: ['Reduced cellular uptake'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 60, y: 60, z: -30 }
    });

    // ==========================================
    // 15. Active Targeting Payload Release Mechanism (Central Core)
    // ==========================================
    const releaseMechanism = new THREE.Group();
    
    const rmCoreGeo = new THREE.OctahedronGeometry(4, 1);
    const rmCore = new THREE.Mesh(rmCoreGeo, steel);
    releaseMechanism.add(rmCore);

    const rmRingGeo = new THREE.TorusGeometry(6, 0.4, 16, 32);
    const rmRing1 = new THREE.Mesh(rmRingGeo, copper);
    rmRing1.rotation.x = Math.PI / 2;
    releaseMechanism.add(rmRing1);

    const rmRing2 = new THREE.Mesh(rmRingGeo, copper);
    rmRing2.rotation.y = Math.PI / 2;
    releaseMechanism.add(rmRing2);

    group.add(releaseMechanism);
    meshes.releaseMechanism = releaseMechanism;

    parts.push({
        name: 'Smart Cargo Release Core',
        description: 'A synthetic nanomechanical structure residing in the exact center of the exosome.',
        material: 'Steel / Copper',
        function: 'Detects intracellular ATP levels and mechanically unzips to release the bound therapeutic RNA in a burst.',
        assemblyOrder: 16,
        connections: ['Therapeutic mRNA Payload', 'Internal Protein Scaffolding'],
        failureEffect: 'Cargo remains tightly bound and is not released inside the target cell.',
        cascadeFailures: ['Therapeutic failure despite successful delivery'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -70, z: 0 }
    });


    // Description and Quiz
    const description = "The Targeted Exosome is an ultra-advanced synthetic-biological hybrid nanoparticle. Engineered to carry high-value therapeutic payloads (mRNA, enzymes) directly to specific diseased cells, it evades the immune system via a PEG corona and CD47 markers, binds selectively to cellular targets using synthetic ligands, and forces membrane fusion. Upon entering the endosome, pH-sensitive proteins rupture the vesicle to release a smart core that disperses the therapeutic payload. Highly optimized for massive precision in modern nanomedicine.";

    const quizQuestions = [
        {
            question: "What is the primary function of the CD47 Stealth Markers embedded in the exosome membrane?",
            options: [
                "To bind to target tumor cells",
                "To send a 'Don't Eat Me' signal to macrophages",
                "To rupture the endosomal membrane",
                "To synthesize mRNA in the bloodstream"
            ],
            correctAnswer: 1,
            explanation: "CD47 is known as the 'Don't Eat Me' signal; it interacts with SIRPα on macrophages to inhibit phagocytosis, thereby extending the circulation time of the exosome in the bloodstream."
        },
        {
            question: "Which component is responsible for changing conformation in an acidic environment to facilitate cytosolic delivery?",
            options: [
                "Cholesterol Lipid Rafts",
                "PEG Polymer Corona",
                "Endosomal Escape Factors",
                "Tetraspanin Clusters"
            ],
            correctAnswer: 2,
            explanation: "Endosomal Escape Factors are pH-sensitive proteins that change shape when the exosome is engulfed in an acidic endosome, tearing the endosomal membrane to release the cargo into the cytoplasm."
        },
        {
            question: "Why are PEG (Polyethylene glycol) chains added to the exterior of the exosome?",
            options: [
                "To provide steric hindrance and mask the exosome from immune surveillance",
                "To catalyze biochemical reactions",
                "To store ATP for the release mechanism",
                "To fold proteins correctly"
            ],
            correctAnswer: 0,
            explanation: "The PEG corona creates a hydration layer and provides steric hindrance, preventing blood serum proteins (opsonins) from binding to the exosome and alerting the immune system."
        },
        {
            question: "What triggers the Smart Cargo Release Core to 'unzip' and deploy the mRNA payload?",
            options: [
                "Exposure to sunlight",
                "Detection of intracellular ATP levels",
                "Contact with red blood cells",
                "High shear stress in capillaries"
            ],
            correctAnswer: 1,
            explanation: "The synthetic nanomechanical core is engineered to detect high levels of intracellular ATP, ensuring the payload is only released once the exosome is successfully inside a living target cell."
        },
        {
            question: "What role do Cholesterol Lipid Rafts play in the exosome membrane structure?",
            options: [
                "They act as enzymes to destroy RNA",
                "They generate light to attract cells",
                "They provide structural rigidity and anchor heavy surface protein complexes",
                "They penetrate the cell nucleus"
            ],
            correctAnswer: 2,
            explanation: "Lipid rafts are tightly packed microdomains of cholesterol and sphingolipids that increase membrane stiffness and serve as stable platforms for signaling and targeting receptor complexes."
        }
    ];

    // Animation Loop
    function animate(time, speed, activeMeshes) {
        // Gently rotate the entire exosome
        group.rotation.y = time * 0.1 * speed;
        group.rotation.x = Math.sin(time * 0.05 * speed) * 0.1;

        // Animate Receptors (Waving motion)
        if (meshes.receptorGroup) {
            meshes.receptorGroup.children.forEach((rec, idx) => {
                // slight bending or waving based on time and index
                const wave = Math.sin(time * speed * 2 + idx) * 0.1;
                const head = rec.children[1];
                if(head) {
                    head.position.x = wave;
                    head.scale.setScalar(1 + Math.sin(time * speed * 5 + idx) * 0.2); // pulsating head
                }
            });
        }

        // Animate RNA Strands (Twisting and moving)
        if (meshes.rnaStrands) {
            meshes.rnaStrands.forEach((strandObj) => {
                strandObj.mesh.rotation.x += strandObj.speedX * speed;
                strandObj.mesh.rotation.y += strandObj.speedY * speed;
            });
        }

        // Animate Folded Proteins
        if (meshes.proteins) {
            meshes.proteins.forEach((protObj) => {
                protObj.mesh.rotation.z += protObj.speedZ * speed;
                protObj.mesh.rotation.x += 0.01 * speed;
            });
        }

        // Animate Release Mechanism (spinning rings)
        if (meshes.releaseMechanism) {
            meshes.releaseMechanism.children[1].rotation.x += 0.05 * speed;
            meshes.releaseMechanism.children[2].rotation.y -= 0.05 * speed;
            const pulse = 1 + Math.sin(time * speed * 3) * 0.1;
            meshes.releaseMechanism.scale.set(pulse, pulse, pulse);
        }

        // Animate Fusion Machinery (Spinning core)
        if (meshes.fusionGroup) {
            meshes.fusionGroup.children.forEach(complex => {
                complex.children[1].rotation.y += 0.1 * speed; // Core spinning
                complex.children[1].scale.setScalar(1 + Math.sin(time * speed * 10) * 0.1);
            });
        }

        // Pulse the Emissive Aqueous Core
        if (meshes.aqueousCore) {
            meshes.aqueousCore.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 2) * 0.3;
            meshes.aqueousCore.rotation.y -= 0.02 * speed;
        }

        // Animate enzymes (Brownian-like motion)
        if (meshes.enzymes) {
            meshes.enzymes.forEach(enzObj => {
                enzObj.mesh.rotateOnAxis(enzObj.axis, enzObj.speed * speed);
                // Oscillate position slightly along its axis
                const offset = Math.sin(time * speed * 5 + enzObj.speed * 1000) * 0.05;
                enzObj.mesh.position.addScaledVector(enzObj.axis, offset);
            });
        }

        // PEG Corona slight expansion/contraction
        if (meshes.pegGroup) {
            const pegScale = 1 + Math.sin(time * speed * 1.5) * 0.02;
            meshes.pegGroup.scale.set(pegScale, pegScale, pegScale);
        }
        
        // Escape Factors pulsating
        if(meshes.escapeFactorsGroup) {
            meshes.escapeFactorsGroup.children.forEach((ef, idx) => {
               ef.scale.y = 1 + Math.abs(Math.sin(time * speed * 4 + idx)) * 0.5; 
            });
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createTargetedExosome() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
