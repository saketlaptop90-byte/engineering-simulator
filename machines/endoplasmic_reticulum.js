export function createEndoplasmicReticulum(THREE) {
    const parts = [];
    
    // Part 1: Nuclear Envelope Connection (Base)
    const baseGeo = new THREE.CylinderGeometry(5, 5, 2, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x8a2be2, roughness: 0.7 });
    const part1 = new THREE.Mesh(baseGeo, baseMat);
    part1.name = "Nuclear Envelope Connection";
    parts.push(part1);

    // Parts 2-4: Rough ER Cisternae (flattened sacs)
    const cisGeo = new THREE.TorusGeometry(6, 1.2, 16, 100);
    const cisMat = new THREE.MeshStandardMaterial({ color: 0xba55d3, roughness: 0.5 });
    
    const part2 = new THREE.Mesh(cisGeo, cisMat);
    part2.position.set(0, 3, 0);
    part2.rotation.x = Math.PI / 2;
    part2.name = "Rough ER Cisterna 1";
    parts.push(part2);

    const part3 = new THREE.Mesh(cisGeo, cisMat);
    part3.position.set(0, 6, 0);
    part3.rotation.x = Math.PI / 2;
    part3.name = "Rough ER Cisterna 2";
    parts.push(part3);

    const part4 = new THREE.Mesh(cisGeo, cisMat);
    part4.position.set(0, 9, 0);
    part4.rotation.x = Math.PI / 2;
    part4.name = "Rough ER Cisterna 3";
    parts.push(part4);

    // Parts 5-7: Ribosome Clusters on the Rough ER
    const ribGeo = new THREE.IcosahedronGeometry(0.6, 2);
    const ribMat = new THREE.MeshStandardMaterial({ color: 0xff3333, roughness: 0.9 });
    
    const part5 = new THREE.Mesh(ribGeo, ribMat);
    part5.name = "Ribosome Cluster 1";
    parts.push(part5);

    const part6 = new THREE.Mesh(ribGeo, ribMat);
    part6.name = "Ribosome Cluster 2";
    parts.push(part6);

    const part7 = new THREE.Mesh(ribGeo, ribMat);
    part7.name = "Ribosome Cluster 3";
    parts.push(part7);

    // Parts 8-10: Smooth ER (tubular structures)
    const tubeGeo = new THREE.CylinderGeometry(0.8, 0.8, 8, 16);
    const smoothMat = new THREE.MeshStandardMaterial({ color: 0xffb6c1, roughness: 0.4 });

    const part8 = new THREE.Mesh(tubeGeo, smoothMat);
    part8.position.set(8, 6, 0);
    part8.name = "Smooth ER Tubule 1";
    parts.push(part8);

    const part9 = new THREE.Mesh(tubeGeo, smoothMat);
    part9.position.set(12, 4, 0);
    part9.name = "Smooth ER Tubule 2";
    parts.push(part9);

    const part10 = new THREE.Mesh(tubeGeo, smoothMat);
    part10.position.set(10, 2, 4);
    part10.name = "Smooth ER Tubule 3";
    parts.push(part10);

    const animationStep = (time) => {
        // Kinematics: Calculate positions based on angular velocity, linear velocity, and simple harmonic motion
        
        parts.forEach((part, index) => {
            // Cisternae (Indices 1-3): Simple Harmonic Motion for membrane undulation
            if (index >= 1 && index <= 3) {
                const amplitude = 0.3;
                const angularFreq = 1.5;
                // Displacement y(t) = y0 + A * sin(omega * t)
                part.position.y = (index * 3) + amplitude * Math.sin(angularFreq * time + index);
            }
            
            // Ribosome Clusters (Indices 4-6): Circular kinematics orbiting the cisternae
            if (index >= 4 && index <= 6) {
                const radius = 6.0;
                const angularVelocity = 1.2; // rad/s
                const phase = index * (Math.PI / 1.5);
                // Centripetal position x = r * cos(w*t + phi), z = r * sin(w*t + phi)
                part.position.x = radius * Math.cos(angularVelocity * time + phase);
                part.position.z = radius * Math.sin(angularVelocity * time + phase);
                
                // Match the vertical displacement of the corresponding cisterna
                const cisternaIndex = index - 3;
                part.position.y = (cisternaIndex * 3) + 0.3 * Math.sin(1.5 * time + cisternaIndex);
            }
            
            // Smooth ER Tubules (Indices 7-9): Rotational kinematics
            if (index >= 7 && index <= 9) {
                const baseRotZ = index % 2 === 0 ? Math.PI / 4 : -Math.PI / 4;
                const angularAccel = 0.05;
                // theta(t) = theta0 + 0.5 * alpha * sin(w*t)
                const theta = 0.5 * angularAccel * Math.sin(time * 2.5);
                part.rotation.x += theta;
                part.rotation.z = baseRotZ + Math.sin(time * 1.5) * 0.2;
            }
        });
    };

    const quiz = [
        {
            question: "What is the primary function of the Rough Endoplasmic Reticulum?",
            options: [
                "Lipid synthesis",
                "Protein synthesis and processing",
                "Energy production",
                "DNA storage"
            ],
            answer: "Protein synthesis and processing"
        },
        {
            question: "Which organelles stud the surface of the Rough ER?",
            options: [
                "Mitochondria",
                "Lysosomes",
                "Ribosomes",
                "Golgi bodies"
            ],
            answer: "Ribosomes"
        },
        {
            question: "What is a main function of the Smooth Endoplasmic Reticulum?",
            options: [
                "Synthesizing proteins",
                "Generating ATP",
                "Synthesizing lipids and detoxifying chemicals",
                "Breaking down cellular waste"
            ],
            answer: "Synthesizing lipids and detoxifying chemicals"
        },
        {
            question: "The structure of the Endoplasmic Reticulum consists of flattened sacs called:",
            options: [
                "Cristae",
                "Cisternae",
                "Vesicles",
                "Vacuoles"
            ],
            answer: "Cisternae"
        },
        {
            question: "The Endoplasmic Reticulum is continuous with which other cellular structure?",
            options: [
                "Plasma membrane",
                "Nuclear envelope",
                "Mitochondrial membrane",
                "Lysosomal membrane"
            ],
            answer: "Nuclear envelope"
        },
        {
            question: "Which type of cells are likely to have an abundant Smooth ER?",
            options: [
                "Muscle cells",
                "Red blood cells",
                "Liver cells (hepatocytes)",
                "Skin cells"
            ],
            answer: "Liver cells (hepatocytes)"
        }
    ];

    return {
        parts,
        animationStep,
        quiz
    };
}
