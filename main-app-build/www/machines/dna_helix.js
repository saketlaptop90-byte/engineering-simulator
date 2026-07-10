export function createDNAHelix(THREE) {
    const root = new THREE.Group();
    root.name = "DNA_Model";

    // 1. Create exactly 10 distinct physical parts (Groups representing components)
    const parts = [
        new THREE.Group(), // 0 Backbone A
        new THREE.Group(), // 1 Backbone B
        new THREE.Group(), // 2 Adenine
        new THREE.Group(), // 3 Thymine
        new THREE.Group(), // 4 Cytosine
        new THREE.Group(), // 5 Guanine
        new THREE.Group(), // 6 Bonds AT
        new THREE.Group(), // 7 Bonds CG
        new THREE.Group(), // 8 Sugars
        new THREE.Group(), // 9 Phosphates
    ];

    parts[0].name = "Backbone_Strand_A";
    parts[1].name = "Backbone_Strand_B";
    parts[2].name = "Adenine_Bases";
    parts[3].name = "Thymine_Bases";
    parts[4].name = "Cytosine_Bases";
    parts[5].name = "Guanine_Bases";
    parts[6].name = "Hydrogen_Bonds_AT";
    parts[7].name = "Hydrogen_Bonds_CG";
    parts[8].name = "Deoxyribose_Sugars";
    parts[9].name = "Phosphate_Groups";

    // Add all 10 distinct groups to the root
    parts.forEach(p => root.add(p));

    // Materials
    const matBackboneA = new THREE.MeshStandardMaterial({ color: 0x00BCD4, roughness: 0.3, metalness: 0.1 });
    const matBackboneB = new THREE.MeshStandardMaterial({ color: 0xFF9800, roughness: 0.3, metalness: 0.1 });
    const matA = new THREE.MeshStandardMaterial({ color: 0x2196F3, roughness: 0.4 });
    const matT = new THREE.MeshStandardMaterial({ color: 0x4CAF50, roughness: 0.4 });
    const matC = new THREE.MeshStandardMaterial({ color: 0x9C27B0, roughness: 0.4 });
    const matG = new THREE.MeshStandardMaterial({ color: 0xE91E63, roughness: 0.4 });
    const matBond = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 });
    const matSugar = new THREE.MeshStandardMaterial({ color: 0xE0E0E0, roughness: 0.5 });
    const matPhosphate = new THREE.MeshStandardMaterial({ color: 0xFFEB3B, roughness: 0.5 });

    // Geometries
    const baseGeo = new THREE.BoxGeometry(2.0, 0.4, 0.8);
    const bondGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.0);
    const sugarGeo = new THREE.DodecahedronGeometry(0.5);
    const phosGeo = new THREE.IcosahedronGeometry(0.4);

    // Helix Parameters
    const numPairs = 40;
    const radius = 3.5;
    const heightStep = 1.0;
    const angleStep = 36 * (Math.PI / 180);

    // Calculate length of backbone segment based on helix pitch
    const backboneDist = Math.sqrt(heightStep * heightStep + Math.pow(radius * angleStep, 2));
    const backboneGeo = new THREE.CylinderGeometry(0.25, 0.25, backboneDist);

    // Helper to spawn meshes and keep reference to their original coordinate metadata for kinematics
    function addMesh(group, geo, mat, a, r, yPos, type) {
        const mesh = new THREE.Mesh(geo, mat);
        mesh.userData = { angle: a, r: r, y: yPos, type: type };
        group.add(mesh);
        return mesh;
    }

    // Assembly loop
    for (let i = 0; i < numPairs; i++) {
        const y = (i - numPairs / 2) * heightStep;
        const angleA = i * angleStep;
        const angleB = angleA + Math.PI;

        // Sugars
        addMesh(parts[8], sugarGeo, matSugar, angleA, radius, y, 'sugar');
        addMesh(parts[8], sugarGeo, matSugar, angleB, radius, y, 'sugar');

        // Phosphates and Backbone connections
        if (i < numPairs - 1) {
            // Place phosphates halfway between current and next sugar
            addMesh(parts[9], phosGeo, matPhosphate, angleA + angleStep / 2, radius + 0.2, y + heightStep / 2, 'phosphate');
            addMesh(parts[9], phosGeo, matPhosphate, angleB + angleStep / 2, radius + 0.2, y + heightStep / 2, 'phosphate');

            // Backbone links
            addMesh(parts[0], backboneGeo, matBackboneA, angleA, radius, y, 'backbone');
            addMesh(parts[1], backboneGeo, matBackboneB, angleB, radius, y, 'backbone');
        }

        // Bases and Hydrogen Bonds
        const pairType = i % 4; // 0: A-T, 1: C-G, 2: T-A, 3: G-C
        const baseCenterR = radius - 1.0;

        if (pairType === 0) {
            addMesh(parts[2], baseGeo, matA, angleA, baseCenterR, y, 'base');
            addMesh(parts[3], baseGeo, matT, angleB, baseCenterR, y, 'base');
            // AT has 2 hydrogen bonds
            addMesh(parts[6], bondGeo, matBond, angleA, 0.2, y, 'bondAT');
            addMesh(parts[6], bondGeo, matBond, angleA, -0.2, y, 'bondAT');
        } else if (pairType === 1) {
            addMesh(parts[4], baseGeo, matC, angleA, baseCenterR, y, 'base');
            addMesh(parts[5], baseGeo, matG, angleB, baseCenterR, y, 'base');
            // CG has 3 hydrogen bonds
            addMesh(parts[7], bondGeo, matBond, angleA, 0.35, y, 'bondCG');
            addMesh(parts[7], bondGeo, matBond, angleA, 0, y, 'bondCG');
            addMesh(parts[7], bondGeo, matBond, angleA, -0.35, y, 'bondCG');
        } else if (pairType === 2) {
            addMesh(parts[3], baseGeo, matT, angleA, baseCenterR, y, 'base');
            addMesh(parts[2], baseGeo, matA, angleB, baseCenterR, y, 'base');
            addMesh(parts[6], bondGeo, matBond, angleA, 0.2, y, 'bondAT');
            addMesh(parts[6], bondGeo, matBond, angleA, -0.2, y, 'bondAT');
        } else if (pairType === 3) {
            addMesh(parts[5], baseGeo, matG, angleA, baseCenterR, y, 'base');
            addMesh(parts[4], baseGeo, matC, angleB, baseCenterR, y, 'base');
            addMesh(parts[7], bondGeo, matBond, angleA, 0.35, y, 'bondCG');
            addMesh(parts[7], bondGeo, matBond, angleA, 0, y, 'bondCG');
            addMesh(parts[7], bondGeo, matBond, angleA, -0.35, y, 'bondCG');
        }
    }

    // Kinematics Helper: Get 3D position given angle, radius, height, and a supercoil twist
    const getPos = (a, r, y, twist) => {
        const ang = a + y * twist;
        return new THREE.Vector3(Math.cos(ang) * r, y, Math.sin(ang) * r);
    };

    // Kinematics update function for components
    const updatePositions = (twist) => {
        const upVector = new THREE.Vector3(0, 1, 0);

        parts.forEach(part => {
            part.children.forEach(mesh => {
                const ud = mesh.userData;
                const a = ud.angle + ud.y * twist;

                if (ud.type === 'bondAT' || ud.type === 'bondCG') {
                    // Position bonds perpendicular to the radial angle
                    const normalAngle = a + Math.PI / 2;
                    mesh.position.x = Math.cos(normalAngle) * ud.r; // ud.r represents lateral offset for bonds
                    mesh.position.z = Math.sin(normalAngle) * ud.r;
                    mesh.position.y = ud.y;
                    mesh.rotation.set(0, 0, 0);
                    mesh.rotation.y = -a;
                    mesh.rotation.z = Math.PI / 2;
                } else if (ud.type === 'backbone') {
                    // Connect current node to next node
                    const curr = getPos(ud.angle, ud.r, ud.y, twist);
                    const nextY = ud.y + heightStep;
                    const nextA = ud.angle + angleStep; 
                    const nextPos = getPos(nextA, ud.r, nextY, twist);

                    // Lerp position to midpoint
                    mesh.position.copy(curr).lerp(nextPos, 0.5);
                    // Align cylinder correctly using quaternion
                    const dir = new THREE.Vector3().subVectors(nextPos, curr).normalize();
                    mesh.quaternion.setFromUnitVectors(upVector, dir);
                } else { 
                    // Bases, sugars, phosphates
                    mesh.position.x = Math.cos(a) * ud.r;
                    mesh.position.y = ud.y;
                    mesh.position.z = Math.sin(a) * ud.r;
                    mesh.rotation.set(0, 0, 0);
                    mesh.rotation.y = -a; // Point inwards radially
                }
            });
        });
    };

    // Initialize default structure
    updatePositions(0);

    // 2. Physical Kinematics Update Function attached to userData
    root.userData.update = (time) => {
        // Continuous rotation around global Y axis
        root.rotation.y = time * 0.4;
        
        // Gentle "breathing" and supercoiling effect driven by sine wave
        const twist = Math.sin(time * 2.0) * 0.03;
        updatePositions(twist);
    };

    // 3. Exactly 6 Quiz Questions
    root.userData.quiz = [
        {
            question: "What are the four main nucleobases found in the nucleic acid of DNA?",
            options: [
                "Adenine, Thymine, Cytosine, Guanine", 
                "Adenine, Uracil, Cytosine, Guanine", 
                "Alanine, Threonine, Cysteine, Glycine", 
                "Adenosine, Thymidine, Cytidine, Guanosine"
            ],
            answer: 0
        },
        {
            question: "Which of the following base pairings occurs naturally in DNA?",
            options: [
                "Adenine-Guanine", 
                "Cytosine-Thymine", 
                "Adenine-Thymine", 
                "Cytosine-Adenine"
            ],
            answer: 2
        },
        {
            question: "What forms the structural backbone of a DNA strand?",
            options: [
                "Nitrogenous bases", 
                "Alternating sugar and phosphate groups", 
                "Hydrogen bonds", 
                "Polypeptide chains"
            ],
            answer: 1
        },
        {
            question: "How many hydrogen bonds typically form between Cytosine and Guanine?",
            options: ["One", "Two", "Three", "Four"],
            answer: 2
        },
        {
            question: "What is the geometric shape of a DNA molecule?",
            options: [
                "Alpha helix", 
                "Double helix", 
                "Beta pleated sheet", 
                "Triple helix"
            ],
            answer: 1
        },
        {
            question: "What type of bond holds the two separate strands of DNA together across the center?",
            options: [
                "Covalent bonds", 
                "Ionic bonds", 
                "Hydrogen bonds", 
                "Phosphodiester bonds"
            ],
            answer: 2
        }
    ];

    return root;
}
