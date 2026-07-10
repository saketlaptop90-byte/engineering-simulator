export function createTunnelBoringMachine(THREE) {
    const group = new THREE.Group();

    // Cutter Head (Front rotating part)
    const cutterGeo = new THREE.CylinderGeometry(3, 3, 0.5, 32);
    const cutterMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.5 });
    const cutter = new THREE.Mesh(cutterGeo, cutterMat);
    cutter.rotation.x = Math.PI / 2;
    cutter.position.z = 5;
    group.add(cutter);

    // Cutting Teeth
    const toothGeo = new THREE.BoxGeometry(0.2, 0.4, 0.2);
    const toothMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    for(let r = 0; r < Math.PI * 2; r += Math.PI / 6) {
        for(let radius = 0.5; radius <= 2.8; radius += 0.5) {
            const tooth = new THREE.Mesh(toothGeo, toothMat);
            tooth.position.set(Math.cos(r) * radius, Math.sin(r) * radius, 0.25);
            tooth.rotation.z = r;
            cutter.add(tooth);
        }
    }

    // Main Shield (Body)
    const shieldGeo = new THREE.CylinderGeometry(2.9, 2.9, 6, 32);
    const shieldMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.6 });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.rotation.x = Math.PI / 2;
    shield.position.z = 2;
    group.add(shield);

    // Conveyor Belt (Internal removing muck)
    const conveyorGeo = new THREE.BoxGeometry(1, 0.2, 10);
    const conveyorMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const conveyor = new THREE.Mesh(conveyorGeo, conveyorMat);
    conveyor.position.set(0, -1, 0);
    group.add(conveyor);

    // Muck (Rocks moving on conveyor)
    const rockGeo = new THREE.DodecahedronGeometry(0.2);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x554433 });
    const rocks = [];
    for(let i=0; i<8; i++) {
        const rock = new THREE.Mesh(rockGeo, rockMat);
        rock.position.set(0, -0.8, 4 - i * 1.2);
        group.add(rock);
        rocks.push(rock);
    }

    // Concrete segments (Tunnel lining behind TBM)
    const liningGeo = new THREE.CylinderGeometry(3.1, 3.3, 1.5, 32, 1, true);
    const liningMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, side: THREE.DoubleSide });
    for(let i=0; i<4; i++) {
        const lining = new THREE.Mesh(liningGeo, liningMat);
        lining.rotation.x = Math.PI / 2;
        lining.position.z = -2 - (i * 1.6);
        group.add(lining);
    }

    group.userData.animate = function(time) {
        // Rotate cutter head
        cutter.rotation.y = time * 0.5;
        
        // Move rocks on conveyor
        rocks.forEach((rock, idx) => {
            rock.position.z -= 0.05;
            if (rock.position.z < -5) {
                rock.position.z = 4; // Reset to front
            }
        });
    };

    group.userData.quiz = [
        { question: "What does TBM stand for?", options: ["Tunnel Boring Machine", "Tubular Boring Mechanism", "Tactical Bore Machine", "Tunnel Building Motor"], answer: 0 },
        { question: "What is the purpose of the shield?", options: ["To protect workers from falling rock while boring", "To make it look cool", "To dig faster", "To steer the machine"], answer: 0 },
        { question: "How does the machine prevent the tunnel from collapsing behind it?", options: ["It installs precast concrete segments", "It uses magic", "It melts the rock into glass", "It doesn't, tunnels never collapse"], answer: 0 }
    ];

    return group;
}
