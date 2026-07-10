import { aluminum, darkSteel, greenPCB, blueAccent, blackPlastic, chrome } from '../utils/materials.js';

export function createCoreRouter(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Chassis
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.6), aluminum);
    chassis.position.y = 0.6;
    group.add(chassis);

    // Line cards
    for (let i = 0; i < 8; i++) {
        const cardGroup = new THREE.Group();
        const yPos = 0.2 + i * 0.12;
        cardGroup.position.set(0, yPos, 0.1);
        cardGroup.name = `LineCard_${i}`;

        const cardBoard = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.02, 0.4), greenPCB);
        cardGroup.add(cardBoard);

        const cardFace = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.1, 0.05), darkSteel);
        cardFace.position.set(0, 0, 0.225);
        cardGroup.add(cardFace);

        // Ports
        for (let p = 0; p < 24; p++) {
            const port = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.02), blackPlastic);
            const px = -0.3 + p * 0.026;
            port.position.set(px, 0, 0.25);
            cardGroup.add(port);

            const led = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.005, 0.005), blueAccent);
            led.position.set(px, 0.02, 0.255);
            cardGroup.add(led);
        }

        group.add(cardGroup);

        // Animate card extraction
        if (i === 3) {
            const times = [0, 2, 4, 6, 8];
            const values = [
                0, yPos, 0.1,
                0, yPos, 0.5,
                0, yPos, 0.5,
                0, yPos, 0.1,
                0, yPos, 0.1
            ];
            const track = new THREE.VectorKeyframeTrack(`${cardGroup.name}.position`, times, values);
            animationClips.push(new THREE.AnimationClip('HotSwapCard', 8, [track]));
        }
    }

    // Fans module
    const fanModule = new THREE.Group();
    fanModule.position.set(0, 0.6, -0.2);
    
    for (let f = 0; f < 4; f++) {
        const pivot = new THREE.Group();
        pivot.position.set(-0.3 + f * 0.2, 0, 0);
        pivot.name = `RouterFanPivot_${f}`;
        
        const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16), chrome);
        fan.rotation.x = Math.PI / 2;
        pivot.add(fan);
        fanModule.add(pivot);

        const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
        const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI);
        const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI * 2);
        
        const qValues = [
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w
        ];
        const track = new THREE.QuaternionKeyframeTrack(`${pivot.name}.quaternion`, [0, 0.5, 1], qValues);
        animationClips.push(new THREE.AnimationClip(`SpinFan_${f}`, 1, [track]));
    }
    group.add(fanModule);

    return { group, animationClips };
}
