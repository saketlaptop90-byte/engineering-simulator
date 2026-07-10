import {
    steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
    rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
    redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
    electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createDNAMolecule(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "DNA (Deoxyribonucleic Acid) Double Helix model. It carries the genetic instructions for the development, functioning, growth, and reproduction of all known organisms.";

    // Materials
    const bbMaterial1 = tinted(whitePlastic, 0xe0e0e0);
    const bbMaterial2 = tinted(whitePlastic, 0xd0d0d0);
    const aMaterial = tinted(plastic, 0xff4444); // Adenine: Red
    const tMaterial = tinted(plastic, 0x4444ff); // Thymine: Blue
    const cMaterial = tinted(plastic, 0x44ff44); // Cytosine: Green
    const gMaterial = tinted(plastic, 0xffff44); // Guanine: Yellow
    
    const hBondMaterial = tinted(glass, 0xeeeeee);
    hBondMaterial.transparent = true;
    hBondMaterial.opacity = 0.6;

    const majorGrooveMat = tinted(glass, 0xffaa00);
    majorGrooveMat.transparent = true;
    majorGrooveMat.opacity = 0.15;
    majorGrooveMat.depthWrite = false;

    const minorGrooveMat = tinted(glass, 0x00aaff);
    minorGrooveMat.transparent = true;
    minorGrooveMat.opacity = 0.15;
    minorGrooveMat.depthWrite = false;

    // Groups for the 10 parts
    const bb1Group = new THREE.Group();
    const bb2Group = new THREE.Group();
    const aGroup = new THREE.Group();
    const tGroup = new THREE.Group();
    const cGroup = new THREE.Group();
    const gGroup = new THREE.Group();
    const hb1Group = new THREE.Group();
    const hb2Group = new THREE.Group();
    const majGroup = new THREE.Group();
    const minGroup = new THREE.Group();

    // Helix structure parameters
    const height = 40;
    const turns = 3.0;
    const radius = 6;
    const steps = 36;
    const angleOffset = 2.4; // 2.4 radians offset creates asymmetric minor and major grooves

    // Random-ish but fixed sequence
    const seq = ['A', 'T', 'C', 'G', 'C', 'A', 'T', 'G', 'A', 'T', 'C', 'G', 'T', 'A', 'C', 'G', 'G', 'C', 'A', 'T', 'T', 'A', 'C', 'G', 'A', 'T', 'G', 'C', 'C', 'G', 'A', 'T', 'C', 'G', 'T', 'A'];

    const points1 = [];
    const points2 = [];
    const minorPoints = [];
    const majorPoints = [];

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const angle1 = t * turns * Math.PI * 2;
        const angle2 = angle1 + angleOffset;
        const y = (t - 0.5) * height;

        const p1 = new THREE.Vector3(Math.cos(angle1) * radius, y, Math.sin(angle1) * radius);
        const p2 = new THREE.Vector3(Math.cos(angle2) * radius, y, Math.sin(angle2) * radius);
        points1.push(p1);
        points2.push(p2);

        // Groove points
        minorPoints.push(new THREE.Vector3(Math.cos(angle1 + angleOffset/2) * (radius * 0.9), y, Math.sin(angle1 + angleOffset/2) * (radius * 0.9)));
        majorPoints.push(new THREE.Vector3(Math.cos(angle1 + Math.PI + angleOffset/2) * (radius * 0.9), y, Math.sin(angle1 + Math.PI + angleOffset/2) * (radius * 0.9)));

        if (i < steps) {
            const type = seq[i % seq.length];
            const dir = new THREE.Vector3().subVectors(p2, p1);
            const dist = dir.length();
            dir.normalize();
            const perp = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();

            let leftLength, rightLength, leftMat, rightMat, isAT, leftGroup, rightGroup;

            if (type === 'A') {
                leftLength = 0.5; rightLength = 0.4;
                leftMat = aMaterial; rightMat = tMaterial;
                isAT = true;
                leftGroup = aGroup; rightGroup = tGroup;
            } else if (type === 'T') {
                leftLength = 0.4; rightLength = 0.5;
                leftMat = tMaterial; rightMat = aMaterial;
                isAT = true;
                leftGroup = tGroup; rightGroup = aGroup;
            } else if (type === 'C') {
                leftLength = 0.4; rightLength = 0.5;
                leftMat = cMaterial; rightMat = gMaterial;
                isAT = false;
                leftGroup = cGroup; rightGroup = gGroup;
            } else if (type === 'G') {
                leftLength = 0.5; rightLength = 0.4;
                leftMat = gMaterial; rightMat = cMaterial;
                isAT = false;
                leftGroup = gGroup; rightGroup = cGroup;
            }

            const leftGeo = new THREE.CylinderGeometry(0.5, 0.5, dist * leftLength, 12);
            const rightGeo = new THREE.CylinderGeometry(0.5, 0.5, dist * rightLength, 12);

            const leftMesh = new THREE.Mesh(leftGeo, leftMat);
            leftMesh.position.copy(p1).add(dir.clone().multiplyScalar(dist * leftLength / 2));
            leftMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
            leftGroup.add(leftMesh);

            const rightMesh = new THREE.Mesh(rightGeo, rightMat);
            rightMesh.position.copy(p2).sub(dir.clone().multiplyScalar(dist * rightLength / 2));
            rightMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
            rightGroup.add(rightMesh);

            const leftEnd = p1.clone().add(dir.clone().multiplyScalar(dist * leftLength));
            const rightEnd = p2.clone().sub(dir.clone().multiplyScalar(dist * rightLength));
            const gapCenter = leftEnd.clone().lerp(rightEnd, 0.5);
            const gapDist = rightEnd.distanceTo(leftEnd);

            const hBondGeo = new THREE.CylinderGeometry(0.12, 0.12, gapDist, 8);

            if (isAT) {
                const bond1 = new THREE.Mesh(hBondGeo, hBondMaterial);
                bond1.position.copy(gapCenter).add(perp.clone().multiplyScalar(0.35));
                bond1.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
                hb1Group.add(bond1);

                const bond2 = new THREE.Mesh(hBondGeo, hBondMaterial);
                bond2.position.copy(gapCenter).sub(perp.clone().multiplyScalar(0.35));
                bond2.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
                hb1Group.add(bond2);
            } else {
                const bond1 = new THREE.Mesh(hBondGeo, hBondMaterial);
                bond1.position.copy(gapCenter).add(perp.clone().multiplyScalar(0.45));
                bond1.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
                hb2Group.add(bond1);

                const bond2 = new THREE.Mesh(hBondGeo, hBondMaterial);
                bond2.position.copy(gapCenter);
                bond2.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
                hb2Group.add(bond2);

                const bond3 = new THREE.Mesh(hBondGeo, hBondMaterial);
                bond3.position.copy(gapCenter).sub(perp.clone().multiplyScalar(0.45));
                bond3.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
                hb2Group.add(bond3);
            }
        }
    }

    const curve1 = new THREE.CatmullRomCurve3(points1);
    const curve2 = new THREE.CatmullRomCurve3(points2);
    const tubeGeo1 = new THREE.TubeGeometry(curve1, 128, 0.8, 16, false);
    const tubeGeo2 = new THREE.TubeGeometry(curve2, 128, 0.8, 16, false);

    const bb1Mesh = new THREE.Mesh(tubeGeo1, bbMaterial1);
    const bb2Mesh = new THREE.Mesh(tubeGeo2, bbMaterial2);
    bb1Group.add(bb1Mesh);
    bb2Group.add(bb2Mesh);

    const minorCurve = new THREE.CatmullRomCurve3(minorPoints);
    const majorCurve = new THREE.CatmullRomCurve3(majorPoints);
    const minorGeo = new THREE.TubeGeometry(minorCurve, 128, 1.8, 16, false);
    const majorGeo = new THREE.TubeGeometry(majorCurve, 128, 3.5, 16, false);

    const minorMesh = new THREE.Mesh(minorGeo, minorGrooveMat);
    const majorMesh = new THREE.Mesh(majorGeo, majorGrooveMat);
    minGroup.add(minorMesh);
    majGroup.add(majorMesh);

    group.add(bb1Group, bb2Group, aGroup, tGroup, cGroup, gGroup, hb1Group, hb2Group, majGroup, minGroup);

    parts.push({
        name: "Sugar-Phosphate Backbone 1",
        group: bb1Group,
        description: "The twisting outer rail consisting of alternating deoxyribose sugar and phosphate groups.",
        material: "White Plastic",
        function: "Provides the structural framework for the sequence of bases.",
        assemblyOrder: 1,
        connections: ["Adenine Base", "Thymine Base", "Cytosine Base", "Guanine Base"],
        failureEffect: "Strand cleavage leading to severe DNA damage.",
        cascadeFailures: ["Loss of genetic information", "Cell cycle arrest"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(-10, 0, 0)
    });

    parts.push({
        name: "Sugar-Phosphate Backbone 2",
        group: bb2Group,
        description: "The anti-parallel complementary twisting rail made of sugar and phosphate.",
        material: "White Plastic",
        function: "Completes the double helix structure, running in the opposite 5' to 3' direction.",
        assemblyOrder: 2,
        connections: ["Adenine Base", "Thymine Base", "Cytosine Base", "Guanine Base"],
        failureEffect: "Unzipping or improper replication.",
        cascadeFailures: ["Replication fork collapse"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(10, 0, 0)
    });

    parts.push({
        name: "Adenine (A) Base",
        group: aGroup,
        description: "A large purine nucleobase that always pairs with Thymine.",
        material: "Red Plastic",
        function: "Encodes genetic information through its sequence along the backbone.",
        assemblyOrder: 3,
        connections: ["Sugar-Phosphate Backbone 1", "Sugar-Phosphate Backbone 2", "Hydrogen Bond 1"],
        failureEffect: "Mispairing during replication if damaged.",
        cascadeFailures: ["Point mutation"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(-5, 5, -5)
    });

    parts.push({
        name: "Thymine (T) Base",
        group: tGroup,
        description: "A smaller pyrimidine nucleobase that pairs strictly with Adenine.",
        material: "Blue Plastic",
        function: "Maintains the uniform width of the DNA helix by pairing only with Adenine.",
        assemblyOrder: 4,
        connections: ["Sugar-Phosphate Backbone 1", "Sugar-Phosphate Backbone 2", "Hydrogen Bond 1"],
        failureEffect: "Formation of thymine dimers due to UV radiation.",
        cascadeFailures: ["Replication blockage", "Skin cancer risk"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(5, 5, 5)
    });

    parts.push({
        name: "Cytosine (C) Base",
        group: cGroup,
        description: "A smaller pyrimidine nucleobase that always pairs with Guanine.",
        material: "Green Plastic",
        function: "Contributes to the GC-content of the DNA, enhancing physical stability.",
        assemblyOrder: 5,
        connections: ["Sugar-Phosphate Backbone 1", "Sugar-Phosphate Backbone 2", "Hydrogen Bond 2"],
        failureEffect: "Deamination into uracil.",
        cascadeFailures: ["C to T mutations"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(-5, -5, 5)
    });

    parts.push({
        name: "Guanine (G) Base",
        group: gGroup,
        description: "A large purine nucleobase that forms strong triple bonds with Cytosine.",
        material: "Yellow Plastic",
        function: "Provides highly stable hydrogen bonding regions within the sequence.",
        assemblyOrder: 6,
        connections: ["Sugar-Phosphate Backbone 1", "Sugar-Phosphate Backbone 2", "Hydrogen Bond 2"],
        failureEffect: "Oxidation to 8-oxoguanine.",
        cascadeFailures: ["G to T transversions"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(5, -5, -5)
    });

    parts.push({
        name: "Hydrogen Bond 1 (A-T Pair)",
        group: hb1Group,
        description: "A double hydrogen bond interface connecting Adenine and Thymine.",
        material: "Glass",
        function: "Holds the two strands together at A-T locations. Relatively easy to separate for transcription.",
        assemblyOrder: 7,
        connections: ["Adenine Base", "Thymine Base"],
        failureEffect: "Premature denaturation of the DNA strand at physiological temperatures.",
        cascadeFailures: ["Strand separation"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 8, 0)
    });

    parts.push({
        name: "Hydrogen Bond 2 (C-G Pair)",
        group: hb2Group,
        description: "A triple hydrogen bond interface connecting Cytosine and Guanine.",
        material: "Glass",
        function: "Holds the two strands together firmly at C-G locations.",
        assemblyOrder: 8,
        connections: ["Cytosine Base", "Guanine Base"],
        failureEffect: "Difficulty in unzipping during transcription or replication.",
        cascadeFailures: ["Slower replication rates"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, -8, 0)
    });

    parts.push({
        name: "Major Groove",
        group: majGroup,
        description: "The wider structural gap in the double helix where the backbones are further apart.",
        material: "Translucent Orange",
        function: "Provides a primary binding site for sequence-specific transcription factors and proteins.",
        assemblyOrder: 9,
        connections: ["Sugar-Phosphate Backbone 1", "Sugar-Phosphate Backbone 2"],
        failureEffect: "Inability of regulatory proteins to bind.",
        cascadeFailures: ["Gene silencing", "Loss of regulation"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 0, -15)
    });

    parts.push({
        name: "Minor Groove",
        group: minGroup,
        description: "The narrower structural gap between the twisting backbones.",
        material: "Translucent Blue",
        function: "Acts as a target for certain non-specific binding proteins and specialized drugs.",
        assemblyOrder: 10,
        connections: ["Sugar-Phosphate Backbone 1", "Sugar-Phosphate Backbone 2"],
        failureEffect: "Drug resistance if molecular shape is altered.",
        cascadeFailures: ["Therapeutic failure"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 0, 15)
    });

    const quizQuestions = [
        {
            question: "Which of the following describes the base pairing rules in DNA?",
            options: [
                "Adenine pairs with Guanine",
                "Cytosine pairs with Thymine",
                "Adenine pairs with Thymine, Cytosine pairs with Guanine",
                "Uracil pairs with Adenine"
            ],
            correctIndex: 2,
            explanation: "According to Chargaff's rules, Adenine always pairs with Thymine, and Cytosine pairs with Guanine.",
            difficulty: "easy"
        },
        {
            question: "How many hydrogen bonds connect Cytosine and Guanine?",
            options: ["One", "Two", "Three", "Four"],
            correctIndex: 2,
            explanation: "C-G pairs are connected by three hydrogen bonds, making them stronger than A-T pairs which have only two.",
            difficulty: "medium"
        },
        {
            question: "Which scientists are primarily credited with discovering the double-helix structure of DNA?",
            options: [
                "Gregor Mendel and Charles Darwin",
                "James Watson, Francis Crick, and Rosalind Franklin",
                "Louis Pasteur and Robert Koch",
                "Linus Pauling and Marie Curie"
            ],
            correctIndex: 1,
            explanation: "Watson and Crick proposed the double-helix structure, heavily relying on X-ray diffraction images taken by Rosalind Franklin.",
            difficulty: "easy"
        },
        {
            question: "Why is the structure of DNA described as 'anti-parallel'?",
            options: [
                "The two strands run in opposite directional orientations",
                "The bases are perpendicular to the backbones",
                "The hydrogen bonds cross each other",
                "One strand is RNA and the other is DNA"
            ],
            correctIndex: 0,
            explanation: "The two sugar-phosphate backbones run in opposite directions (5' to 3' and 3' to 5'), which is required for proper base pairing.",
            difficulty: "medium"
        },
        {
            question: "What are the individual building blocks (monomers) of DNA called?",
            options: [
                "Amino acids",
                "Fatty acids",
                "Nucleotides",
                "Monosaccharides"
            ],
            correctIndex: 2,
            explanation: "DNA is a polymer made of nucleotides, each containing a phosphate group, a sugar molecule, and a nitrogenous base.",
            difficulty: "easy"
        },
        {
            question: "What makes hydrogen bonding ideal for connecting the two DNA strands?",
            options: [
                "They are the strongest type of chemical bond",
                "They are weak enough to be separated for replication but strong enough together to hold the helix",
                "They covalently bind the bases together permanently",
                "They prevent any enzymes from accessing the genetic code"
            ],
            correctIndex: 1,
            explanation: "Hydrogen bonds are individually weak but collectively strong, allowing the DNA to 'unzip' for replication and transcription while remaining stable normally.",
            difficulty: "hard"
        }
    ];

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate: function(time, speed, meshes) {
            group.rotation.y = time * 0.0005 * speed;
            
            const pulse = 1 + Math.sin(time * 0.005) * 0.4;
            const groovePulse = 1 + Math.sin(time * 0.002) * 0.05;

            meshes.forEach(m => {
                if (m.name.includes("Hydrogen Bond")) {
                    m.group.children.forEach(child => {
                        child.scale.set(pulse, 1, pulse);
                    });
                }
                if (m.name.includes("Groove")) {
                    m.group.scale.set(groovePulse, 1, groovePulse);
                }
            });
        }
    };
}
