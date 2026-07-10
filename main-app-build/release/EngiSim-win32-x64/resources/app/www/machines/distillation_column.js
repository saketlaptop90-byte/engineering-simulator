export function createDistillationColumn(THREE) {
    const group = new THREE.Group();

    // 1. Reboiler
    const reboilerGeom = new THREE.CylinderGeometry(2, 2, 4, 32);
    const reboilerMat = new THREE.MeshStandardMaterial({ color: 0xaa5555 });
    const reboiler = new THREE.Mesh(reboilerGeom, reboilerMat);
    reboiler.position.set(4, 2, 0);
    reboiler.rotation.z = Math.PI / 2;
    group.add(reboiler);

    // 2. Main Column Shell
    const columnGeom = new THREE.CylinderGeometry(1.5, 1.5, 20, 32);
    const columnMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3 });
    const columnShell = new THREE.Mesh(columnGeom, columnMat);
    columnShell.position.set(0, 10, 0);
    group.add(columnShell);

    // 3. Bubble Cap Trays
    const traysGroup = new THREE.Group();
    const trayCount = 8;
    for (let i = 0; i < trayCount; i++) {
        const trayGeom = new THREE.CylinderGeometry(1.4, 1.4, 0.1, 32);
        const trayMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const tray = new THREE.Mesh(trayGeom, trayMat);
        tray.position.set(0, 2 + i * 2.2, 0);
        
        // Add bubble caps to tray
        const capGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16);
        const capMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
        for (let j = 0; j < 4; j++) {
            const cap = new THREE.Mesh(capGeom, capMat);
            cap.position.set(0.6 * Math.cos(j * Math.PI / 2), 0.2, 0.6 * Math.sin(j * Math.PI / 2));
            tray.add(cap);
        }
        
        traysGroup.add(tray);
    }
    group.add(traysGroup);

    // 4. Feed Inlet
    const feedGeom = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const feedMat = new THREE.MeshStandardMaterial({ color: 0x55aa55 });
    const feedInlet = new THREE.Mesh(feedGeom, feedMat);
    feedInlet.position.set(-2, 10, 0);
    feedInlet.rotation.z = Math.PI / 2;
    group.add(feedInlet);

    // 5. Overhead Condenser
    const condenserGeom = new THREE.BoxGeometry(3, 2, 2);
    const condenserMat = new THREE.MeshStandardMaterial({ color: 0x5555aa });
    const condenser = new THREE.Mesh(condenserGeom, condenserMat);
    condenser.position.set(4, 21, 0);
    group.add(condenser);

    // 6. Reflux Drum
    const drumGeom = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const drumMat = new THREE.MeshStandardMaterial({ color: 0xaa55aa });
    const drum = new THREE.Mesh(drumGeom, drumMat);
    drum.position.set(8, 18, 0);
    drum.rotation.z = Math.PI / 2;
    group.add(drum);

    // 7. Distillate Outlet
    const distillateGeom = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const distillateMat = new THREE.MeshStandardMaterial({ color: 0xffff55 });
    const distillateOutlet = new THREE.Mesh(distillateGeom, distillateMat);
    distillateOutlet.position.set(10, 16.5, 0);
    group.add(distillateOutlet);

    // 8. Bottoms Outlet
    const bottomsGeom = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const bottomsMat = new THREE.MeshStandardMaterial({ color: 0x442222 });
    const bottomsOutlet = new THREE.Mesh(bottomsGeom, bottomsMat);
    bottomsOutlet.position.set(0, -1, 0);
    group.add(bottomsOutlet);

    // 9. Temperature Sensors
    const sensorsGroup = new THREE.Group();
    const sensorGeom = new THREE.SphereGeometry(0.2, 16, 16);
    const sensorMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    for (let i = 0; i < 3; i++) {
        const sensor = new THREE.Mesh(sensorGeom, sensorMat);
        sensor.position.set(1.5, 5 + i * 5, 0);
        sensorsGroup.add(sensor);
    }
    group.add(sensorsGroup);

    // 10. Support Structure
    const supportGroup = new THREE.Group();
    const legGeom = new THREE.CylinderGeometry(0.2, 0.2, 10, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    for (let i = 0; i < 4; i++) {
        const leg = new THREE.Mesh(legGeom, legMat);
        leg.position.set(1.2 * Math.cos(i * Math.PI / 2 + Math.PI/4), 5, 1.2 * Math.sin(i * Math.PI / 2 + Math.PI/4));
        supportGroup.add(leg);
    }
    group.add(supportGroup);

    // Animation state: liquid falling and vapor rising
    const droplets = new THREE.Group();
    const dropletGeom = new THREE.SphereGeometry(0.05, 8, 8);
    const dropletMat = new THREE.MeshStandardMaterial({ color: 0x88ccff });
    for(let i = 0; i < 40; i++) {
        const drop = new THREE.Mesh(dropletGeom, dropletMat);
        drop.userData = {
            yOffset: Math.random() * 20,
            speed: 1 + Math.random() * 2,
            radius: Math.random() * 1.2
        };
        droplets.add(drop);
    }
    group.add(droplets);
    
    const bubbles = new THREE.Group();
    const bubbleGeom = new THREE.SphereGeometry(0.08, 8, 8);
    const bubbleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
    for(let i = 0; i < 40; i++) {
        const bubble = new THREE.Mesh(bubbleGeom, bubbleMat);
        bubble.userData = {
            yOffset: Math.random() * 20,
            speed: 1 + Math.random() * 2,
            radius: Math.random() * 1.2
        };
        bubbles.add(bubble);
    }
    group.add(bubbles);

    group.userData.update = function(t) {
        // Liquid cascading down trays
        droplets.children.forEach(drop => {
            let y = 20 - ((t * drop.userData.speed + drop.userData.yOffset) % 20);
            let angle = t * 2 + drop.userData.yOffset;
            let x = drop.userData.radius * Math.cos(angle);
            let z = drop.userData.radius * Math.sin(angle);
            drop.position.set(x, y, z);
        });

        // Vapor bubbling up through caps
        bubbles.children.forEach(bubble => {
            let y = (t * bubble.userData.speed + bubble.userData.yOffset) % 20;
            let angle = -t * 1.5 + bubble.userData.yOffset;
            let x = bubble.userData.radius * Math.cos(angle);
            let z = bubble.userData.radius * Math.sin(angle);
            bubble.position.set(x, y, z);
        });
    };

    group.userData.quiz = [
        {
            question: "What is the primary function of the reboiler in a fractional distillation column?",
            options: ["To condense the overhead vapor", "To provide heat to the bottom of the column to vaporize liquid", "To feed the mixture into the column", "To collect the distillate"],
            answer: 1
        },
        {
            question: "What is the purpose of bubble cap trays inside the distillation column?",
            options: ["To support the column structure", "To measure temperature", "To ensure intimate contact between rising vapor and falling liquid", "To pump liquid to the top"],
            answer: 2
        },
        {
            question: "Where is the overhead condenser located?",
            options: ["At the bottom of the column", "In the middle of the column", "At the top of the column to cool and condense the vapor", "Outside the plant"],
            answer: 2
        },
        {
            question: "What does the reflux drum do?",
            options: ["It stores the bottoms product", "It provides heat to the column", "It collects condensed liquid to be partially returned to the column as reflux", "It measures the pressure of the system"],
            answer: 2
        },
        {
            question: "Why are temperature sensors placed along the column?",
            options: ["To monitor the temperature gradient, which indicates the composition profile", "To measure the flow rate", "To heat the fluid", "To calculate the volume of the column"],
            answer: 0
        },
        {
            question: "Which stream contains the heaviest (highest boiling point) components?",
            options: ["Distillate outlet", "Overhead vapor", "Feed inlet", "Bottoms outlet"],
            answer: 3
        }
    ];

    return group;
}
