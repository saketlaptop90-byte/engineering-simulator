import { materials } from '../utils/materials.js';

export function createCapacitorBank(THREE) {
    const group = new THREE.Group();

    const matRack = materials?.steel || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.4 });
    const matCapacitor = materials?.paintGrey || new THREE.MeshStandardMaterial({ color: 0x99aab5, roughness: 0.6 });
    const matInsulator = materials?.ceramic || new THREE.MeshStandardMaterial({ color: 0xecf0f1, roughness: 0.8 });
    const matLEDOff = new THREE.MeshBasicMaterial({ color: 0x003300 });
    const matLEDOn = materials?.led || new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    // Main Rack
    const rackGeo = new THREE.BoxGeometry(4, 5, 2);
    const rackEdges = new THREE.EdgesGeometry(rackGeo);
    const rack = new THREE.LineSegments(rackEdges, new THREE.LineBasicMaterial({ color: 0x444444, linewidth: 2 }));
    group.add(rack);

    const leds = new THREE.Group();
    leds.name = "ledGroup";
    group.add(leds);

    // Individual Capacitors
    const capGeo = new THREE.BoxGeometry(0.8, 1.2, 0.4);
    const terminalGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8);
    const insGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.3, 8);
    const ledGeo = new THREE.SphereGeometry(0.05, 8, 8);

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            const capGroup = new THREE.Group();
            
            const cap = new THREE.Mesh(capGeo, matCapacitor);
            capGroup.add(cap);
            
            // Bushings / Insulators
            const ins1 = new THREE.Mesh(insGeo, matInsulator);
            ins1.position.set(-0.2, 0.75, 0);
            capGroup.add(ins1);
            
            const ins2 = new THREE.Mesh(insGeo, matInsulator);
            ins2.position.set(0.2, 0.75, 0);
            capGroup.add(ins2);

            // Terminals
            const term1 = new THREE.Mesh(terminalGeo, matRack);
            term1.position.set(-0.2, 0.9, 0);
            capGroup.add(term1);

            const term2 = new THREE.Mesh(terminalGeo, matRack);
            term2.position.set(0.2, 0.9, 0);
            capGroup.add(term2);

            // Status LED
            const led = new THREE.Mesh(ledGeo, matLEDOn);
            led.position.set(0, 0.5, 0.25);
            leds.add(led); // Add to separate group for bulk animation

            capGroup.position.set(-1.5 + col * 1.0, -1.8 + row * 1.6, 0);
            group.add(capGroup);
        }
    }

    // Busbars connecting the banks
    const busbarGeo = new THREE.BoxGeometry(3.5, 0.05, 0.05);
    const matBusbar = materials?.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.6, roughness: 0.2 });
    
    for (let row = 0; row < 3; row++) {
        const busbar1 = new THREE.Mesh(busbarGeo, matBusbar);
        busbar1.position.set(0, -1.8 + row * 1.6 + 0.9, 0.1);
        group.add(busbar1);

        const busbar2 = new THREE.Mesh(busbarGeo, matBusbar);
        busbar2.position.set(0, -1.8 + row * 1.6 + 0.9, -0.1);
        group.add(busbar2);
    }

    // Animations: LEDs blinking and slight vibration
    const times = [0, 0.5, 1.0, 1.5, 2.0];
    
    // LEDs flashing by scaling them down/up
    const scaleValues = [
        1, 1, 1,
        0.1, 0.1, 0.1,
        1, 1, 1,
        0.1, 0.1, 0.1,
        1, 1, 1
    ];
    const ledTrack = new THREE.VectorKeyframeTrack('ledGroup.scale', times, scaleValues);

    // Humming vibration
    // Extend vibration throughout the 2 second clip
    const fullVibTimes = [];
    const fullVibValues = [];
    for(let i=0; i<=20; i++) {
        fullVibTimes.push(i * 0.1);
        fullVibValues.push(
            (Math.random() - 0.5) * 0.04,
            (Math.random() - 0.5) * 0.04,
            0
        );
    }
    const vibTrack = new THREE.VectorKeyframeTrack('.position', fullVibTimes, fullVibValues);

    const clip = new THREE.AnimationClip('BankActive', 2.0, [ledTrack, vibTrack]);

    return { group, animationClips: [clip] };
}
