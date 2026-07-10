import {
  steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
  rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
  redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
  electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function create(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Materials - Using stunning emissive materials
    const adenineMaterial = tinted(redAccent, 0xff0000);
    adenineMaterial.emissive = new THREE.Color(0xaa0000);
    adenineMaterial.emissiveIntensity = 0.5;

    const thymineMaterial = tinted(greenAccent, 0x00ff00);
    thymineMaterial.emissive = new THREE.Color(0x00aa00);
    thymineMaterial.emissiveIntensity = 0.5;

    const cytosineMaterial = tinted(blueAccent, 0x0000ff);
    cytosineMaterial.emissive = new THREE.Color(0x0000aa);
    cytosineMaterial.emissiveIntensity = 0.5;

    const guanineMaterial = tinted(yellowAccent, 0xffff00);
    guanineMaterial.emissive = new THREE.Color(0xaaaa00);
    guanineMaterial.emissiveIntensity = 0.5;

    const backboneMaterial = tinted(whitePlastic, 0xffffff);
    backboneMaterial.emissive = new THREE.Color(0x444444);
    backboneMaterial.emissiveIntensity = 0.4;

    const hBondMaterial = tinted(glass, 0xffffff);
    hBondMaterial.emissive = new THREE.Color(0xffffff);
    hBondMaterial.emissiveIntensity = 0.8;
    hBondMaterial.transparent = true;
    hBondMaterial.opacity = 0.6;

    const histoneMat = tinted(purpleAccent, 0x8844aa);
    histoneMat.emissive = new THREE.Color(0x441166);
    histoneMat.emissiveIntensity = 0.3;

    const invisibleMat = new THREE.MeshBasicMaterial({ visible: false });

    // Geometry Parameters
    const numPairs = 30;
    const height = 20;
    const twist = Math.PI * 6; // 3 full turns
    const radius = 3;

    // Groups
    const adenineGroup = new THREE.Group();
    const thymineGroup = new THREE.Group();
    const cytosineGroup = new THREE.Group();
    const guanineGroup = new THREE.Group();
    const hBondGroup = new THREE.Group();
    const backboneLeftGroup = new THREE.Group();
    const backboneRightGroup = new THREE.Group();
    const majorGrooveGroup = new THREE.Group();
    const minorGrooveGroup = new THREE.Group();
    const histoneGroup = new THREE.Group();

    group.add(adenineGroup, thymineGroup, cytosineGroup, guanineGroup, hBondGroup);
    group.add(backboneLeftGroup, backboneRightGroup, majorGrooveGroup, minorGrooveGroup, histoneGroup);

    // Offsets to create major and minor grooves
    const offsetLeft = 0;
    const offsetRight = 2.5; // Radians. Creates asymmetry for grooves.

    const dist = 2 * radius * Math.sin((offsetRight - offsetLeft) / 2);
    const baseLength = dist / 2;

    const baseGeom = new THREE.CylinderGeometry(0.3, 0.3, baseLength - 0.2, 16);
    baseGeom.rotateZ(Math.PI / 2);

    const hBondGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 8);
    hBondGeom.rotateZ(Math.PI / 2);

    for (let i = 0; i < numPairs; i++) {
        const t = i / (numPairs - 1);
        const y = (t - 0.5) * height;

        const angleLeft = t * twist + offsetLeft;
        const angleRight = t * twist + offsetRight;

        const pLeftX = Math.cos(angleLeft) * radius;
        const pLeftZ = Math.sin(angleLeft) * radius;
        
        const pRightX = Math.cos(angleRight) * radius;
        const pRightZ = Math.sin(angleRight) * radius;
        
        const midX = (pLeftX + pRightX) / 2;
        const midZ = (pLeftZ + pRightZ) / 2;
        
        const dx = pRightX - pLeftX;
        const dz = pRightZ - pLeftZ;
        const angleY = Math.atan2(dz, dx);

        const b1X = pLeftX + dx * 0.25;
        const b1Z = pLeftZ + dz * 0.25;
        
        const b2X = pLeftX + dx * 0.75;
        const b2Z = pLeftZ + dz * 0.75;

        const isAT = i % 2 === 0;
        const flip = (Math.floor(i / 2) % 2 === 0);

        const b1Mesh = new THREE.Mesh(baseGeom, isAT ? (flip ? adenineMaterial : thymineMaterial) : (flip ? cytosineMaterial : guanineMaterial));
        b1Mesh.position.set(b1X, y, b1Z);
        b1Mesh.rotation.y = -angleY;
        
        const b2Mesh = new THREE.Mesh(baseGeom, isAT ? (flip ? thymineMaterial : adenineMaterial) : (flip ? guanineMaterial : cytosineMaterial));
        b2Mesh.position.set(b2X, y, b2Z);
        b2Mesh.rotation.y = -angleY;

        if (isAT) {
            if (flip) {
                adenineGroup.add(b1Mesh);
                thymineGroup.add(b2Mesh);
            } else {
                thymineGroup.add(b1Mesh);
                adenineGroup.add(b2Mesh);
            }
        } else {
            if (flip) {
                cytosineGroup.add(b1Mesh);
                guanineGroup.add(b2Mesh);
            } else {
                guanineGroup.add(b1Mesh);
                cytosineGroup.add(b2Mesh);
            }
        }

        const hbond = new THREE.Mesh(hBondGeom, hBondMaterial);
        hbond.position.set(midX, y, midZ);
        hbond.rotation.y = -angleY;
        hBondGroup.add(hbond);
    }

    class HelixCurve extends THREE.Curve {
        constructor(radius, height, twist, offset) {
            super();
            this.radius = radius;
            this.height = height;
            this.twist = twist;
            this.offset = offset;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const y = (t - 0.5) * this.height;
            const angle = t * this.twist + this.offset;
            const x = Math.cos(angle) * this.radius;
            const z = Math.sin(angle) * this.radius;
            return optionalTarget.set(x, y, z);
        }
    }

    const backboneGeom1 = new THREE.TubeGeometry(new HelixCurve(radius, height, twist, offsetLeft), 100, 0.6, 16, false);
    backboneLeftGroup.add(new THREE.Mesh(backboneGeom1, backboneMaterial));

    const backboneGeom2 = new THREE.TubeGeometry(new HelixCurve(radius, height, twist, offsetRight), 100, 0.6, 16, false);
    backboneRightGroup.add(new THREE.Mesh(backboneGeom2, backboneMaterial));

    const majorGrooveGeom = new THREE.TubeGeometry(new HelixCurve(radius, height, twist, (offsetLeft + offsetRight) / 2 + Math.PI), 100, 1.0, 8, false);
    majorGrooveGroup.add(new THREE.Mesh(majorGrooveGeom, invisibleMat));

    const minorGrooveGeom = new THREE.TubeGeometry(new HelixCurve(radius, height, twist, (offsetLeft + offsetRight) / 2), 100, 0.5, 8, false);
    minorGrooveGroup.add(new THREE.Mesh(minorGrooveGeom, invisibleMat));

    const histoneGeom = new THREE.SphereGeometry(4, 32, 32);
    const histoneMesh = new THREE.Mesh(histoneGeom, histoneMat);
    histoneMesh.position.set(0, -height / 2 - 5, 0);
    histoneGroup.add(histoneMesh);

    // Add Parts Metadata
    parts.push({
        group: adenineGroup,
        name: "Adenine Base",
        description: "A purine nucleobase that pairs with thymine.",
        material: "Red Emissive",
        function: "Forms two hydrogen bonds with thymine.",
        assemblyOrder: 1,
        connections: ["Hydrogen Bonds", "Phosphate Backbone Left", "Phosphate Backbone Right"],
        failureEffect: "Mutation, substitution with wrong base.",
        cascadeFailures: ["Incorrect protein synthesis"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 0, z: 0 }
    });

    parts.push({
        group: thymineGroup,
        name: "Thymine Base",
        description: "A pyrimidine nucleobase that pairs with adenine.",
        material: "Green Emissive",
        function: "Forms two hydrogen bonds with adenine.",
        assemblyOrder: 2,
        connections: ["Hydrogen Bonds", "Phosphate Backbone Left", "Phosphate Backbone Right"],
        failureEffect: "Dimerization under UV light.",
        cascadeFailures: ["DNA replication fork stall"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -15, y: 0, z: 0 }
    });

    parts.push({
        group: cytosineGroup,
        name: "Cytosine Base",
        description: "A pyrimidine nucleobase that pairs with guanine.",
        material: "Blue Emissive",
        function: "Forms three hydrogen bonds with guanine.",
        assemblyOrder: 3,
        connections: ["Hydrogen Bonds", "Phosphate Backbone Left", "Phosphate Backbone Right"],
        failureEffect: "Deamination to uracil.",
        cascadeFailures: ["Point mutation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 15 }
    });

    parts.push({
        group: guanineGroup,
        name: "Guanine Base",
        description: "A purine nucleobase that pairs with cytosine.",
        material: "Yellow Emissive",
        function: "Forms three hydrogen bonds with cytosine.",
        assemblyOrder: 4,
        connections: ["Hydrogen Bonds", "Phosphate Backbone Left", "Phosphate Backbone Right"],
        failureEffect: "Oxidation.",
        cascadeFailures: ["Mismatch pairing"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -15 }
    });

    parts.push({
        group: backboneLeftGroup,
        name: "Phosphate Backbone Left",
        description: "The structural framework of nucleic acids.",
        material: "White Plastic",
        function: "Provides structural support for the base pairs.",
        assemblyOrder: 5,
        connections: ["Adenine Base", "Thymine Base", "Cytosine Base", "Guanine Base"],
        failureEffect: "Strand break.",
        cascadeFailures: ["Loss of genetic information"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: 0 }
    });

    parts.push({
        group: backboneRightGroup,
        name: "Phosphate Backbone Right",
        description: "The antiparallel structural framework.",
        material: "White Plastic",
        function: "Completes the double helix structure.",
        assemblyOrder: 6,
        connections: ["Adenine Base", "Thymine Base", "Cytosine Base", "Guanine Base"],
        failureEffect: "Strand break.",
        cascadeFailures: ["Double strand break leading to cell death"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 0 }
    });

    parts.push({
        group: hBondGroup,
        name: "Hydrogen Bonds",
        description: "Weak bonds between the complementary bases.",
        material: "Glass / Glowing",
        function: "Holds the two DNA strands together while allowing them to be separated.",
        assemblyOrder: 7,
        connections: ["Adenine Base", "Thymine Base", "Cytosine Base", "Guanine Base"],
        failureEffect: "Strand separation.",
        cascadeFailures: ["Denaturation of DNA"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    parts.push({
        group: majorGrooveGroup,
        name: "Major Groove",
        description: "The wider of the two grooves spiraling along the DNA.",
        material: "Invisible",
        function: "Primary site for transcription factor binding.",
        assemblyOrder: 8,
        connections: ["Phosphate Backbone Left", "Phosphate Backbone Right"],
        failureEffect: "Inaccessible to proteins.",
        cascadeFailures: ["Failure of gene expression"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    parts.push({
        group: minorGrooveGroup,
        name: "Minor Groove",
        description: "The narrower of the two grooves spiraling along the DNA.",
        material: "Invisible",
        function: "Binds some smaller architectural proteins.",
        assemblyOrder: 9,
        connections: ["Phosphate Backbone Left", "Phosphate Backbone Right"],
        failureEffect: "Structural instability.",
        cascadeFailures: ["Reduced DNA flexibility"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    parts.push({
        group: histoneGroup,
        name: "Histone Protein",
        description: "Large protein complexes around which DNA wraps.",
        material: "Purple Core",
        function: "Compacts and organizes DNA into nucleosomes.",
        assemblyOrder: 10,
        connections: ["Phosphate Backbone Left", "Phosphate Backbone Right"],
        failureEffect: "Disorganized chromatin.",
        cascadeFailures: ["Cell division failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    const description = "A detailed interactive 3D model of a DNA Double Helix, demonstrating base pairing, phosphate backbones, and histone wrapping.";

    const quizQuestions = [
        {
            question: "Which base pair is held together by three hydrogen bonds?",
            options: ["Adenine - Thymine", "Guanine - Cytosine", "Adenine - Uracil", "Cytosine - Thymine"],
            correct: 1,
            explanation: "Guanine and Cytosine form three hydrogen bonds, making their bond stronger than A-T which forms only two.",
            difficulty: "Medium"
        },
        {
            question: "What forms the structural backbone of a DNA molecule?",
            options: ["Nitrogenous bases", "Histone proteins", "Sugar-phosphate groups", "Hydrogen bonds"],
            correct: 2,
            explanation: "The sides of the DNA double helix are formed by alternating sugar (deoxyribose) and phosphate groups.",
            difficulty: "Easy"
        },
        {
            question: "Around which protein complex does DNA wrap to form nucleosomes?",
            options: ["Polymerase", "Helicase", "Histones", "Ligase"],
            correct: 2,
            explanation: "DNA wraps around octamers of histone proteins to form nucleosomes, the fundamental repeating units of chromatin.",
            difficulty: "Medium"
        },
        {
            question: "Adenine always pairs with which base in DNA?",
            options: ["Cytosine", "Guanine", "Uracil", "Thymine"],
            correct: 3,
            explanation: "According to Chargaff's rules, Adenine always pairs with Thymine in DNA.",
            difficulty: "Easy"
        },
        {
            question: "Why does DNA have a major and minor groove?",
            options: ["Due to the asymmetrical attachment of base pairs to the sugar rings", "Because histones pull unevenly", "Due to random twisting", "To separate A-T and G-C pairs"],
            correct: 0,
            explanation: "The glycosidic bonds connecting the base pairs to the backbone are not diametrically opposite, creating a wider (major) and narrower (minor) groove.",
            difficulty: "Hard"
        },
        {
            question: "Which bases are classified as purines?",
            options: ["Cytosine and Thymine", "Adenine and Guanine", "Thymine and Uracil", "Adenine and Cytosine"],
            correct: 1,
            explanation: "Purines are double-ringed structures, which include Adenine and Guanine. Pyrimidines are single-ringed (Cytosine, Thymine, Uracil).",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        meshes.forEach(part => {
            if (part.group) {
                part.group.rotation.y = time * 0.3 * speed;
                part.group.position.y = Math.sin(time * speed) * 0.5;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

export const createDNA = create;
