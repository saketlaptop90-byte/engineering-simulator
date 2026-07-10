import { darkSteel, lead, plastic, redAccent, greenAccent, aluminum } from '../utils/materials.js';

export function createUPSBank(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main cabinet
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.0, 0.8), darkSteel);
    cabinet.position.y = 1.0;
    group.add(cabinet);

    // Battery modules
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 2; c++) {
            const moduleGroup = new THREE.Group();
            const xPos = -0.2 + c * 0.4;
            const yPos = 0.2 + r * 0.2;
            moduleGroup.position.set(xPos, yPos, 0.0);
            moduleGroup.name = `BatteryModule_${r}_${c}`;

            const batBody = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.7), lead);
            moduleGroup.add(batBody);

            const batFace = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.16, 0.02), plastic);
            batFace.position.set(0, 0, 0.36);
            moduleGroup.add(batFace);

            const led = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.02), greenAccent);
            led.position.set(0.1, 0, 0.37);
            moduleGroup.add(led);

            group.add(moduleGroup);

            // Animate one module being replaced
            if (r === 4 && c === 1) {
                const times = [0, 1, 3, 4, 6];
                const values = [
                    xPos, yPos, 0,
                    xPos, yPos, 0.4,
                    xPos, yPos, 0.4,
                    xPos, yPos, 0,
                    xPos, yPos, 0
                ];
                const track = new THREE.VectorKeyframeTrack(`${moduleGroup.name}.position`, times, values);
                animationClips.push(new THREE.AnimationClip(`ReplaceBattery`, 6, [track]));
            }
        }
    }

    // Top Exhaust Fans
    for (let i = 0; i < 2; i++) {
        const fanPivot = new THREE.Group();
        fanPivot.position.set(-0.2 + i * 0.4, 2.0, 0);
        fanPivot.name = `UPSFan_${i}`;

        const fanGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 8);
        const fan = new THREE.Mesh(fanGeo, aluminum);
        fanPivot.add(fan);
        group.add(fanPivot);

        const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
        const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
        const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2);
        
        const qValues = [
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w
        ];
        const track = new THREE.QuaternionKeyframeTrack(`${fanPivot.name}.quaternion`, [0, 0.5, 1], qValues);
        animationClips.push(new THREE.AnimationClip(`UPSFanSpin_${i}`, 1, [track]));
    }

    return { group, animationClips };
}
