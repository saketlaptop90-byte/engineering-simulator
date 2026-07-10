export function createForestCanopy(THREE) {
    const modelGroup = new THREE.Group();

    // 1. Forest Floor
    const floorGeo = new THREE.BoxGeometry(10, 0.2, 10);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x3d2817 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, 0, 0);
    floor.userData.name = 'Forest Floor';
    modelGroup.add(floor);

    // 2. Soil Layers
    const soilGeo = new THREE.BoxGeometry(10, 2, 10);
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x241508 });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.set(0, -1.1, 0);
    soil.userData.name = 'Soil Layers';
    modelGroup.add(soil);

    // 3. Tree Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.4, 0.6, 8, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(0, 4, 0);
    trunk.userData.name = 'Tree Trunk';
    modelGroup.add(trunk);

    // 4. Canopy Leaves
    const canopyGeo = new THREE.DodecahedronGeometry(3.5, 1);
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 8, 0);
    canopy.userData.name = 'Canopy Leaves';
    modelGroup.add(canopy);

    // 5. Understory Shrubs
    const shrubGeo = new THREE.DodecahedronGeometry(1.2, 1);
    const shrubMat = new THREE.MeshStandardMaterial({ color: 0x32cd32 });
    const shrub = new THREE.Mesh(shrubGeo, shrubMat);
    shrub.position.set(2, 0.7, 2);
    shrub.userData.name = 'Understory Shrubs';
    modelGroup.add(shrub);

    // 6. Fungi/Mushrooms
    const fungiGroup = new THREE.Group();
    const stemGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3);
    const capGeo = new THREE.ConeGeometry(0.2, 0.2, 8);
    const fungiMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const capMat = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
    const stem = new THREE.Mesh(stemGeo, fungiMat);
    stem.position.set(0, 0.15, 0);
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(0, 0.3, 0);
    fungiGroup.add(stem);
    fungiGroup.add(cap);
    fungiGroup.position.set(-1.5, 0.1, -1.5);
    fungiGroup.userData.name = 'Fungi/Mushrooms';
    modelGroup.add(fungiGroup);

    // 7. Roots
    const rootGroup = new THREE.Group();
    const rootGeo = new THREE.CylinderGeometry(0.15, 0.3, 1.5);
    const rootMat = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
    for (let i = 0; i < 3; i++) {
        const root = new THREE.Mesh(rootGeo, rootMat);
        const angle = (Math.PI * 2 / 3) * i;
        root.rotation.z = Math.PI / 4;
        root.rotation.y = angle;
        root.position.set(Math.cos(angle) * 0.6, 0.2, Math.sin(angle) * 0.6);
        rootGroup.add(root);
    }
    rootGroup.userData.name = 'Roots';
    modelGroup.add(rootGroup);

    // 8. Bird Nest
    const nestGroup = new THREE.Group();
    const nestGeo = new THREE.TorusGeometry(0.3, 0.1, 8, 16);
    const nestMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const nest = new THREE.Mesh(nestGeo, nestMat);
    nest.rotation.x = Math.PI / 2;
    nestGroup.add(nest);
    
    // Add a couple of eggs
    const eggGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const eggMat = new THREE.MeshStandardMaterial({ color: 0xadd8e6 });
    const egg1 = new THREE.Mesh(eggGeo, eggMat);
    egg1.position.set(0.1, 0.05, 0);
    const egg2 = new THREE.Mesh(eggGeo, eggMat);
    egg2.position.set(-0.05, 0.05, 0.1);
    nestGroup.add(egg1, egg2);

    nestGroup.position.set(1.5, 6, 1.5);
    nestGroup.userData.name = 'Bird Nest';
    modelGroup.add(nestGroup);

    // 9. Insects
    const insectGeo = new THREE.SphereGeometry(0.05, 4, 4);
    const insectMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const insects = new THREE.Group();
    for(let i=0; i<8; i++) {
        const insect = new THREE.Mesh(insectGeo, insectMat);
        insect.position.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);
        insects.add(insect);
    }
    insects.position.set(2, 2, 2);
    insects.userData.name = 'Insects';
    modelGroup.add(insects);

    // 10. Rain
    const rainGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.4);
    const rainMat = new THREE.MeshBasicMaterial({ color: 0xadd8e6, transparent: true, opacity: 0.6 });
    const rainGroup = new THREE.Group();
    const raindrops = [];
    for(let i=0; i<30; i++) {
        const drop = new THREE.Mesh(rainGeo, rainMat);
        drop.position.set((Math.random() - 0.5) * 8, 5 + Math.random() * 5, (Math.random() - 0.5) * 8);
        rainGroup.add(drop);
        raindrops.push(drop);
    }
    rainGroup.userData.name = 'Rain';
    modelGroup.add(rainGroup);

    modelGroup.userData.animation = (time) => {
        canopy.rotation.x = Math.sin(time * 2) * 0.05;
        canopy.rotation.z = Math.cos(time * 1.5) * 0.05;

        insects.children.forEach((insect, index) => {
            insect.position.y += Math.sin(time * 5 + index) * 0.005;
            insect.position.x += Math.cos(time * 4 + index) * 0.005;
        });

        raindrops.forEach(drop => {
            drop.position.y -= 0.3;
            if (drop.position.y < 0) {
                drop.position.y = 8 + Math.random() * 4;
            }
        });
    };

    modelGroup.userData.questions = [
        {
            text: "Which layer of the forest forms the primary 'roof' that blocks out most sunlight from reaching below?",
            options: ["Forest Floor", "Understory", "Canopy", "Soil Layer"],
            correctAnswer: 2
        },
        {
            text: "What is the primary role of fungi in the forest biome?",
            options: ["Photosynthesis", "Decomposition", "Pollination", "Seed Dispersal"],
            correctAnswer: 1
        },
        {
            text: "Which layer of the forest typically has the highest humidity and lowest light?",
            options: ["Canopy", "Emergent Layer", "Understory", "Forest Floor"],
            correctAnswer: 3
        },
        {
            text: "Why do trees in dense forests tend to grow very tall and straight?",
            options: ["To avoid ground predators", "To reach the sunlight in the canopy", "Because of high soil moisture", "To resist strong winds"],
            correctAnswer: 1
        },
        {
            text: "What characterizes the understory layer?",
            options: ["Tall trees over 100 feet", "Shrubs, young trees, and shade-tolerant plants", "Bare soil with no vegetation", "Only moss and fungi"],
            correctAnswer: 1
        },
        {
            text: "What function do deep tree roots serve aside from anchoring the tree?",
            options: ["Absorbing sunlight", "Storing seeds", "Absorbing water and nutrients from soil layers", "Catching rainfall before it hits the ground"],
            correctAnswer: 2
        }
    ];

    return modelGroup;
}
