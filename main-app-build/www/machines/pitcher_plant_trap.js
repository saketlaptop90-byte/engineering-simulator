export function createPitcherPlantTrap(THREE) {
    const group = new THREE.Group();

    // 1. Tendril (attaches to the leaf, supports pitcher)
    const tendrilGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
    const tendrilMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const tendril = new THREE.Mesh(tendrilGeo, tendrilMat);
    tendril.position.set(0, -3.5, 0);
    tendril.userData = { id: 'tendril', name: 'Tendril' };
    group.add(tendril);

    // 2. Pitcher Body (main tube)
    const bodyGeo = new THREE.CylinderGeometry(1.2, 0.6, 4, 16, 1, true);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x8FBC8F, side: THREE.DoubleSide });
    const pitcherBody = new THREE.Mesh(bodyGeo, bodyMat);
    pitcherBody.position.set(0, 0, 0);
    pitcherBody.userData = { id: 'pitcher_body', name: 'Pitcher Body' };
    group.add(pitcherBody);

    // 3. Peristome (the ribbed rim)
    const peristomeGeo = new THREE.TorusGeometry(1.2, 0.2, 16, 32);
    const peristomeMat = new THREE.MeshStandardMaterial({ color: 0x8B0000 }); // Dark Red
    const peristome = new THREE.Mesh(peristomeGeo, peristomeMat);
    peristome.position.set(0, 2, 0);
    peristome.rotation.x = Math.PI / 2;
    peristome.userData = { id: 'peristome', name: 'Peristome' };
    group.add(peristome);

    // 4. Operculum / Lid (umbrella above the rim)
    const lidGeo = new THREE.CircleGeometry(1.4, 32);
    const lidMat = new THREE.MeshStandardMaterial({ color: 0x8FBC8F, side: THREE.DoubleSide });
    const operculum = new THREE.Mesh(lidGeo, lidMat);
    operculum.position.set(0, 2.5, -1);
    operculum.rotation.x = -Math.PI / 4;
    operculum.userData = { id: 'operculum', name: 'Operculum/Lid' };
    group.add(operculum);

    // 5. Nectar Glands (on the underside of the lid)
    const glandGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const glandMat = new THREE.MeshStandardMaterial({ color: 0xFFD700 }); // Gold
    const nectarGlands = new THREE.Group();
    for (let i = 0; i < 10; i++) {
        const gland = new THREE.Mesh(glandGeo, glandMat);
        gland.position.set((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, -0.05);
        nectarGlands.add(gland);
    }
    nectarGlands.position.copy(operculum.position);
    nectarGlands.rotation.copy(operculum.rotation);
    nectarGlands.userData = { id: 'nectar_glands', name: 'Nectar Glands' };
    group.add(nectarGlands);

    // 6. Waxy Zone (slippery inner wall, top half)
    const waxyGeo = new THREE.CylinderGeometry(1.15, 0.9, 2, 16, 1, true);
    const waxyMat = new THREE.MeshStandardMaterial({ color: 0xA9DFBF, side: THREE.BackSide, roughness: 0.1, metalness: 0.3 });
    const waxyZone = new THREE.Mesh(waxyGeo, waxyMat);
    waxyZone.position.set(0, 1, 0);
    waxyZone.userData = { id: 'waxy_zone', name: 'Waxy Zone' };
    group.add(waxyZone);

    // 7. Glandular Zone (digestive lower inner wall)
    const glandularGeo = new THREE.CylinderGeometry(0.9, 0.55, 2, 16, 1, true);
    const glandularMat = new THREE.MeshStandardMaterial({ color: 0x7D3C98, side: THREE.BackSide, roughness: 0.8 });
    const glandularZone = new THREE.Mesh(glandularGeo, glandularMat);
    glandularZone.position.set(0, -1, 0);
    glandularZone.userData = { id: 'glandular_zone', name: 'Glandular Zone' };
    group.add(glandularZone);

    // 8. Digestive Fluid pool (liquid at the bottom)
    const fluidGeo = new THREE.CylinderGeometry(0.8, 0.55, 1, 16);
    const fluidMat = new THREE.MeshStandardMaterial({ color: 0x4A235A, transparent: true, opacity: 0.8 });
    const fluidPool = new THREE.Mesh(fluidGeo, fluidMat);
    fluidPool.position.set(0, -1.4, 0);
    fluidPool.userData = { id: 'digestive_fluid', name: 'Digestive Fluid pool' };
    group.add(fluidPool);

    // 9. Downward-pointing Hairs (around the inner rim)
    const hairGeo = new THREE.ConeGeometry(0.02, 0.4, 4);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const hairsGroup = new THREE.Group();
    for (let i = 0; i < 24; i++) {
        const hair = new THREE.Mesh(hairGeo, hairMat);
        const angle = (i / 24) * Math.PI * 2;
        hair.position.set(Math.cos(angle) * 1.1, 1.8, Math.sin(angle) * 1.1);
        hair.rotation.set(Math.PI / 4, angle, 0); // pointing downwards and inwards
        hairsGroup.add(hair);
    }
    hairsGroup.userData = { id: 'downward_hairs', name: 'Downward-pointing Hairs' };
    group.add(hairsGroup);

    // 10. Captured Insect (the victim)
    const insectGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const insectMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const capturedInsect = new THREE.Mesh(insectGeo, insectMat);
    capturedInsect.position.set(0, 2.5, 0);
    capturedInsect.userData = { id: 'captured_insect', name: 'Captured Insect' };
    group.add(capturedInsect);

    // Animation variables
    let insectState = 0; // 0 = hovering, 1 = slipping, 2 = digesting
    let slipProgress = 0;
    
    // Bubble particles for digestion
    const bubbles = new THREE.Group();
    const bubbleGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const bubbleMat = new THREE.MeshStandardMaterial({ color: 0x9B59B6, transparent: true, opacity: 0.6 });
    for (let i = 0; i < 5; i++) {
        const b = new THREE.Mesh(bubbleGeo, bubbleMat);
        b.position.set((Math.random() - 0.5), -1.4 + Math.random(), (Math.random() - 0.5));
        bubbles.add(b);
    }
    group.add(bubbles);

    function animate(delta, time) {
        // Insect animation
        if (insectState === 0) {
            // Hovering near the peristome
            capturedInsect.position.x = Math.sin(time * 2) * 1.2;
            capturedInsect.position.z = Math.cos(time * 2) * 1.2;
            capturedInsect.position.y = 2.2 + Math.sin(time * 10) * 0.1;
            
            if (time % 10 > 3 && Math.sin(time) > 0.9) {
                insectState = 1; // Start slipping
            }
        } else if (insectState === 1) {
            // Slipping down the waxy zone
            slipProgress += delta * 1.5;
            capturedInsect.position.y = 2.2 - slipProgress * 3;
            capturedInsect.position.x *= 0.95; // Spiral towards center
            capturedInsect.position.z *= 0.95;
            
            if (capturedInsect.position.y <= -1.2) {
                insectState = 2; // Digesting
                capturedInsect.position.set(0, -1.2, 0);
            }
        } else if (insectState === 2) {
            // Digesting: twitching and sinking slowly
            capturedInsect.position.x = (Math.random() - 0.5) * 0.1;
            capturedInsect.position.z = (Math.random() - 0.5) * 0.1;
            capturedInsect.position.y -= delta * 0.05;
            // capturedInsect.scale.setScalar(Math.max(0.1, 1 - slipProgress * 0.5));
            
            if (capturedInsect.position.y < -1.6) {
                // Reset loop
                insectState = 0;
                slipProgress = 0;
                capturedInsect.scale.setScalar(1);
            }
        }

        // Fluid and bubbles animation
        fluidPool.scale.y = 1 + Math.sin(time * 3) * 0.05;
        bubbles.children.forEach((bubble) => {
            bubble.position.y += delta * 0.5;
            if (bubble.position.y > -0.9) {
                bubble.position.y = -1.6;
                bubble.position.x = (Math.random() - 0.5) * 0.8;
                bubble.position.z = (Math.random() - 0.5) * 0.8;
            }
        });
    }

    const questions = [
        {
            question: "What is the primary function of the pitcher plant's peristome?",
            options: [
                "To perform photosynthesis",
                "To secrete sweet nectar and provide a slippery foothold",
                "To absorb water from rain",
                "To release seeds"
            ],
            correctAnswer: 1,
            explanation: "The peristome is the colorful, ribbed rim that secretes nectar to attract prey and becomes extremely slippery when wet, causing insects to fall in."
        },
        {
            question: "Why do pitcher plants eat insects?",
            options: [
                "For extra calories/energy",
                "Because they cannot photosynthesize",
                "To obtain essential nutrients like nitrogen and phosphorus missing in their soil",
                "To protect themselves from herbivores"
            ],
            correctAnswer: 2,
            explanation: "Carnivorous plants typically grow in nutrient-poor bogs. They use photosynthesis for energy, but trap insects to supplement essential minerals."
        },
        {
            question: "What is the main purpose of the operculum (lid) in most Nepenthes pitcher plants?",
            options: [
                "To snap shut and trap insects",
                "To prevent rain from diluting the digestive fluid",
                "To act as a solar panel",
                "To release toxic gas"
            ],
            correctAnswer: 1,
            explanation: "Unlike a Venus flytrap, the pitcher plant's lid does not close. Instead, it acts as an umbrella to keep excess rainwater from filling the trap and diluting the enzymes."
        },
        {
            question: "Which feature prevents insects from climbing out of the pitcher?",
            options: [
                "A layer of sticky glue",
                "A waxy zone and downward-pointing hairs",
                "A closing lid",
                "Electric shocks"
            ],
            correctAnswer: 1,
            explanation: "The interior walls often feature a waxy layer that prevents grip, along with downward-pointing hairs that make climbing back up nearly impossible."
        },
        {
            question: "How does the pitcher plant digest its prey?",
            options: [
                "By chewing it",
                "By crushing it with its walls",
                "Using secreted enzymes and symbiotic bacteria in the fluid pool",
                "By burning it with acid"
            ],
            correctAnswer: 2,
            explanation: "The fluid at the bottom contains digestive enzymes secreted by the plant, often aided by bacteria, which break down the insect's body."
        },
        {
            question: "What is the name of the structure that supports the pitcher trap?",
            options: [
                "Root",
                "Tendril",
                "Stamen",
                "Petal"
            ],
            correctAnswer: 1,
            explanation: "The pitcher is a modified leaf, and it is usually supported by an extension of the leaf's midrib called a tendril."
        }
    ];

    return {
        group,
        animate,
        questions
    };
}
