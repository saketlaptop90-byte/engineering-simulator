import { wood, brass, copper, darkSteel, glass } from '../utils/materials.js';

export function createPunchCardReader(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main body
    const bodyGeom = new THREE.BoxGeometry(8, 6, 5);
    const body = new THREE.Mesh(bodyGeom, darkSteel);
    body.position.y = 3;
    group.add(body);

    // Card feed tray (input)
    const trayInGeom = new THREE.BoxGeometry(6, 0.2, 4);
    const trayIn = new THREE.Mesh(trayInGeom, wood);
    trayIn.position.set(-6, 4, 0);
    trayIn.rotation.z = -Math.PI / 8;
    group.add(trayIn);

    // Card feed tray (output)
    const trayOutGeom = new THREE.BoxGeometry(6, 0.2, 4);
    const trayOut = new THREE.Mesh(trayOutGeom, wood);
    trayOut.position.set(6, 2, 0);
    trayOut.rotation.z = -Math.PI / 8;
    group.add(trayOut);

    // Card
    const cardGroup = new THREE.Group();
    cardGroup.name = "punch_card_group";
    
    const cardGeom = new THREE.BoxGeometry(3, 0.05, 2);
    const cardMat = new THREE.MeshStandardMaterial({ color: 0xf5deb3 });
    const card = new THREE.Mesh(cardGeom, cardMat);
    cardGroup.add(card);

    // Draw some holes on the card as dark spots
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
    for(let r = 0; r < 4; r++) {
        for(let c = 0; c < 10; c++) {
            if (Math.random() > 0.5) {
                const hole = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.25), holeMat);
                hole.position.set(-1.2 + c * 0.25, 0, -0.7 + r * 0.4);
                cardGroup.add(hole);
            }
        }
    }

    cardGroup.position.set(-5, 4.2, 0);
    cardGroup.rotation.z = -Math.PI / 8;
    group.add(cardGroup);

    // Reading mechanism wheels
    const wheels = [];
    for(let i = 0; i < 4; i++) {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(-2 + i * 1.5, 5.2, 0);
        wheelGroup.name = `reader_wheel_${i}`;

        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.2), brass);
        wheel.rotation.x = Math.PI / 2;
        wheelGroup.add(wheel);
        
        // Add spokes or lines so rotation is visible
        const marker = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.1, 2.3), darkSteel);
        wheelGroup.add(marker);

        group.add(wheelGroup);
        wheels.push(wheelGroup);
    }

    // Animation: Card moving and wheels spinning
    const tracks = [];
    
    // Card sliding through
    const cardTrack = new THREE.VectorKeyframeTrack(
        `${cardGroup.name}.position`,
        [0, 1.5, 2],
        [-5, 4.5, 0,    5, 2.5, 0,    -5, 4.5, 0] // Move across, snap back
    );
    tracks.push(cardTrack);

    wheels.forEach(wheelGroup => {
        const qStart = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
        const qMid = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI * 4);
        const qEnd = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI * 8);

        const wheelTrack = new THREE.QuaternionKeyframeTrack(
            `${wheelGroup.name}.quaternion`,
            [0, 1.5, 2],
            [...qStart.toArray(), ...qMid.toArray(), ...qEnd.toArray()]
        );
        tracks.push(wheelTrack);
    });

    const clip = new THREE.AnimationClip('ReadCard', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
