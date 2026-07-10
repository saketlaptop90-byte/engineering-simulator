import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const mucosaMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff6b81,
        roughness: 0.4,
        transmission: 0.6,
        thickness: 0.5,
        transparent: true,
        opacity: 0.85
    });

    const enterocyteMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4757,
        roughness: 0.6,
        metalness: 0.1
    });

    const gobletCellMaterial = new THREE.MeshStandardMaterial({
        color: 0x2ed573,
        roughness: 0.2,
        metalness: 0.3,
        emissive: 0x1e90ff,
        emissiveIntensity: 0.2
    });

    const capillaryBloodMaterial = new THREE.MeshStandardMaterial({
        color: 0xeb4d4b,
        roughness: 0.3,
        emissive: 0xc23616,
        emissiveIntensity: 0.4
    });

    const lactealMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf1f2f6,
        transmission: 0.9,
        transparent: true,
        opacity: 0.9,
        emissive: 0x7bed9f,
        emissiveIntensity: 0.6
    });

    const nutrientMaterial = new THREE.MeshStandardMaterial({
        color: 0xeccc68,
        emissive: 0xffa502,
        emissiveIntensity: 1.0
    });

    // 1. Base Mucosa (The foundation)
    const baseGeo = new THREE.CylinderGeometry(8, 8, 2, 32);
    const baseMesh = new THREE.Mesh(baseGeo, mucosaMaterial);
    baseMesh.position.set(0, -1, 0);
    group.add(baseMesh);

    parts.push({
        name: "Mucosal Base",
        description: "The underlying layer of connective tissue supporting the villi.",
        material: "Mucosa Tissue",
        function: "Provides structural support and houses larger blood vessels and lymphatics.",
        assemblyOrder: 1,
        connections: ["Villus Core", "Submucosa"],
        failureEffect: "Collapse of villi structure.",
        cascadeFailures: ["Loss of nutrient absorption surface area."],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 2. Villus Core (The main finger projection)
    const villusGeo = new THREE.CapsuleGeometry(2.5, 8, 16, 32);
    const villusMesh = new THREE.Mesh(villusGeo, mucosaMaterial);
    villusMesh.position.set(0, 4, 0);
    group.add(villusMesh);

    parts.push({
        name: "Villus Structure",
        description: "The main finger-like projection extending into the intestinal lumen.",
        material: "Translucent Tissue",
        function: "Dramatically increases the surface area for nutrient absorption.",
        assemblyOrder: 2,
        connections: ["Mucosal Base", "Epithelial Layer"],
        failureEffect: "Villus atrophy (e.g., Celiac disease).",
        cascadeFailures: ["Malabsorption", "Nutrient deficiency"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 3. Lacteal (Central Lymphatic Vessel)
    const lactealGeo = new THREE.CylinderGeometry(0.6, 0.4, 6, 16);
    const lactealMesh = new THREE.Mesh(lactealGeo, lactealMaterial);
    lactealMesh.position.set(0, 4, 0);
    group.add(lactealMesh);

    parts.push({
        name: "Central Lacteal",
        description: "A lymphatic capillary located in the center of the villus.",
        material: "Glowing Lymphatic Tissue",
        function: "Absorbs dietary fats and lipid-soluble vitamins.",
        assemblyOrder: 3,
        connections: ["Villus Core", "Lymphatic System"],
        failureEffect: "Inability to absorb fats.",
        cascadeFailures: ["Steatorrhea", "Fat-soluble vitamin deficiencies (A, D, E, K)"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 5 }
    });

    // 4. Capillary Network (Surrounding the lacteal)
    const capillaryGeo = new THREE.TorusGeometry(1.5, 0.15, 8, 24);
    const meshes = {};
    meshes.capillaries = [];

    for (let i = 0; i < 4; i++) {
        const cap = new THREE.Mesh(capillaryGeo, capillaryBloodMaterial);
        cap.position.set(0, 2 + i * 1.5, 0);
        cap.rotation.x = Math.PI / 2;
        group.add(cap);
        meshes.capillaries.push(cap);
    }

    parts.push({
        name: "Capillary Network",
        description: "A dense network of blood capillaries wrapping around the lacteal.",
        material: "Crimson Endothelium",
        function: "Absorbs water-soluble nutrients like amino acids and monosaccharides.",
        assemblyOrder: 4,
        connections: ["Villus Core", "Hepatic Portal Vein"],
        failureEffect: "Decreased absorption of carbohydrates and proteins.",
        cascadeFailures: ["Systemic malnutrition", "Weight loss"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 4, z: -5 }
    });

    // 5. Enterocytes (Absorptive Cells) & Microvilli
    const cellGeo = new THREE.BoxGeometry(0.8, 1, 0.8);
    meshes.cells = [];
    
    // Distribute cells around the villus surface
    for (let y = 1; y <= 7; y++) {
        const radius = y > 6 ? 1.5 : 2.5; // Tapering at the top
        const count = y > 6 ? 6 : 12;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const cell = new THREE.Mesh(cellGeo, enterocyteMaterial);
            cell.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
            
            // Align cell with surface normal
            cell.lookAt(0, y, 0);
            
            group.add(cell);
            meshes.cells.push(cell);
        }
    }

    parts.push({
        name: "Enterocytes (Epithelium)",
        description: "Simple columnar epithelial cells covering the villus.",
        material: "Cellular Membrane",
        function: "Actively transport nutrients from the lumen into the villus core.",
        assemblyOrder: 5,
        connections: ["Villus Core", "Lumen"],
        failureEffect: "Loss of transport mechanisms.",
        cascadeFailures: ["Osmotic diarrhea", "Bacterial overgrowth"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 5, y: 4, z: 0 }
    });

    // 6. Nutrient Particles (Animated)
    const particleGeo = new THREE.SphereGeometry(0.15, 8, 8);
    meshes.nutrients = [];

    for (let i = 0; i < 40; i++) {
        const particle = new THREE.Mesh(particleGeo, nutrientMaterial);
        
        // Random starting positions in the "lumen" space
        const radius = 3 + Math.random() * 4;
        const angle = Math.random() * Math.PI * 2;
        const yPos = Math.random() * 10;
        
        particle.position.set(Math.cos(angle) * radius, yPos, Math.sin(angle) * radius);
        
        // Store target properties for animation
        particle.userData = {
            angle: angle,
            radius: radius,
            yPos: yPos,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 1.5,
            absorbed: false,
            absorbTarget: new THREE.Vector3()
        };
        
        group.add(particle);
        meshes.nutrients.push(particle);
    }

    const description = "The Intestinal Villi are highly specialized microscopic structures in the small intestine designed as an ultra-efficient nutrient extraction machine. By utilizing macroscopic folding (villi) and microscopic folding (microvilli), they increase the internal surface area of the intestine by up to 600 times. This high-tech simulation visualizes the epithelial enterocytes actively absorbing glowing nutrient particles, transferring water-soluble molecules into the crimson capillary network, and funneling lipids into the neon-green central lacteal. It is an extraordinary feat of biological engineering, optimizing mass transfer across a selectively permeable membrane.";

    const quizQuestions = [
        {
            question: "Which specific structure within the villus is primarily responsible for the absorption of dietary fats?",
            options: [
                "The capillary network",
                "The central lacteal",
                "The goblet cells",
                "The muscularis mucosae"
            ],
            correct: 1,
            explanation: "The central lacteal is a specialized lymphatic capillary that absorbs dietary fats (lipids) and fat-soluble vitamins, which are too large to directly enter the blood capillaries.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary biological engineering purpose of the villi and microvilli structure?",
            options: [
                "To propel food through the digestive tract",
                "To secrete acid for breaking down proteins",
                "To maximize surface area for nutrient absorption",
                "To house symbiotic bacteria"
            ],
            correct: 2,
            explanation: "Villi and microvilli dramatically increase the surface area of the small intestine (by a factor of ~600), creating a massive interface for efficient diffusion and active transport of nutrients.",
            difficulty: "Easy"
        },
        {
            question: "Water-soluble nutrients (like amino acids and glucose) absorbed by the capillary network in the villi are first transported directly to which organ?",
            options: [
                "The heart",
                "The kidneys",
                "The liver",
                "The brain"
            ],
            correct: 2,
            explanation: "Blood from the intestinal capillaries drains into the superior mesenteric vein, which joins the hepatic portal vein to carry nutrient-rich blood directly to the liver for processing and detoxification before reaching the rest of the body.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, exploded) {
        // Animate Enterocytes (subtle pulsing/breathing)
        if (!exploded && meshes.cells) {
            meshes.cells.forEach((cell, i) => {
                const scale = 1 + Math.sin(time * 2 * speed + i) * 0.05;
                cell.scale.set(scale, scale, scale);
            });
        }

        // Animate Lacteal (glowing throb)
        if (lactealMesh && lactealMaterial) {
            lactealMaterial.emissiveIntensity = 0.6 + Math.sin(time * 3 * speed) * 0.3;
        }

        // Animate Capillaries (blood flow effect via scaling)
        if (!exploded && meshes.capillaries) {
            meshes.capillaries.forEach((cap, i) => {
                const scale = 1 + Math.sin(time * 5 * speed - i * 1.5) * 0.08;
                cap.scale.set(scale, scale, 1); // Only scale radially
            });
        }

        // Animate Nutrient Particles (Absorption cycle)
        if (!exploded && meshes.nutrients) {
            meshes.nutrients.forEach(particle => {
                const data = particle.userData;
                
                if (!data.absorbed) {
                    // Swirl around the villus
                    data.angle += 0.5 * speed * 0.01;
                    
                    // Gradually move inwards
                    if (data.radius > 2.8) {
                        data.radius -= 0.02 * speed;
                    } else {
                        // Reached the surface, trigger absorption
                        data.absorbed = true;
                        // Decide if it goes to capillary or lacteal
                        data.isFat = Math.random() > 0.6;
                    }
                    
                    // Vertical bobbing
                    data.yPos += Math.sin(time * data.speed + data.phase) * 0.02 * speed;
                    
                    particle.position.set(
                        Math.cos(data.angle) * data.radius,
                        data.yPos,
                        Math.sin(data.angle) * data.radius
                    );
                    
                    // High energy glow outside
                    nutrientMaterial.emissiveIntensity = 1.0;
                } else {
                    // Absorbed state: moving to center
                    if (data.isFat) {
                        // Move to lacteal (center)
                        particle.position.lerp(new THREE.Vector3(0, data.yPos, 0), 0.05 * speed);
                        particle.material.color.setHex(0x7bed9f); // Turn green for fat
                    } else {
                        // Move to capillary (ring)
                        const targetRadius = 1.5;
                        const targetX = Math.cos(data.angle) * targetRadius;
                        const targetZ = Math.sin(data.angle) * targetRadius;
                        particle.position.lerp(new THREE.Vector3(targetX, data.yPos, targetZ), 0.05 * speed);
                        particle.material.color.setHex(0xff6b81); // Turn red for water-soluble
                    }
                    
                    // Fade out as it enters circulation
                    particle.scale.multiplyScalar(0.95);
                    
                    // Reset when completely absorbed
                    if (particle.scale.x < 0.1) {
                        data.absorbed = false;
                        data.radius = 4 + Math.random() * 4;
                        data.yPos = Math.random() * 10;
                        particle.scale.set(1, 1, 1);
                        particle.material.color.setHex(0xeccc68);
                    }
                }
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
export function createIntestinalVilli() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
