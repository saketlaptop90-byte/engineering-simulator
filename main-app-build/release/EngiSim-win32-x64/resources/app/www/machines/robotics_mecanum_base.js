import { materials } from '../utils/materials.js';

export function createMecanumBase(THREE) {
    const group = new THREE.Group();
    
    const matChassis = materials?.metal || new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.4 });
    const matWheel = materials?.plastic || new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.2, roughness: 0.8 });
    const matRoller = materials?.rubber || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.1, roughness: 0.9 });
    
    // Chassis
    const chassisGeo = new THREE.BoxGeometry(4, 0.5, 6);
    const chassis = new THREE.Mesh(chassisGeo, matChassis);
    chassis.position.y = 1;
    group.add(chassis);

    const createMecanumWheel = (x, z) => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(x, 0.8, z);
        group.add(wheelGroup);

        const hubGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 32);
        hubGeo.rotateZ(Math.PI / 2);
        const hub = new THREE.Mesh(hubGeo, matWheel);
        wheelGroup.add(hub);

        // Add rollers
        const numRollers = 8;
        for (let i = 0; i < numRollers; i++) {
            const angle = (i * Math.PI * 2) / numRollers;
            const rollerGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
            
            // 45 degree angle for mecanum
            rollerGeo.rotateX(Math.PI / 4);

            const roller = new THREE.Mesh(rollerGeo, matRoller);
            roller.position.set(0, Math.cos(angle) * 0.7, Math.sin(angle) * 0.7);
            
            wheelGroup.add(roller);
        }

        return wheelGroup;
    };

    const w1 = createMecanumWheel(2.2, 2.5);
    const w2 = createMecanumWheel(-2.2, 2.5);
    const w3 = createMecanumWheel(2.2, -2.5);
    const w4 = createMecanumWheel(-2.2, -2.5);

    // Animation: forward driving then strafing
    const wheels = [w1, w2, w3, w4];
    const tracks = [];

    wheels.forEach((w, index) => {
        const qVals = [];
        let currentAngle = 0;
        for (let t = 0; t <= 24; t++) {
            const time = t * 0.25; // 0 to 6 seconds
            if (time <= 2) {
                currentAngle += Math.PI * 0.25; // forward
            } else if (time <= 3) {
                // pause
            } else if (time <= 5) {
                // strafe right (w1, w4 opposite w2, w3)
                currentAngle += (index === 0 || index === 3) ? -Math.PI * 0.25 : Math.PI * 0.25;
            }
            // else pause for last second
            
            const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), currentAngle);
            qVals.push(...q.toArray());
        }
        
        const wheelTimes = Array.from({length: 25}, (_, i) => i * 0.25);
        tracks.push(new THREE.QuaternionKeyframeTrack(`${w.uuid}.quaternion`, wheelTimes, qVals));
    });

    const animationClip = new THREE.AnimationClip('MecanumDrive', 6, tracks);

    return { group, animationClips: [animationClip] };
}
