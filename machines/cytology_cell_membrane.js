export function createCellMembrane(THREE) {
    const group = new THREE.Group();

    const headGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x3388ff });
    
    const tailGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
    const tailMat = new THREE.MeshStandardMaterial({ color: 0xffffaa });

    const bilayerGroup = new THREE.Group();

    for (let x = -5; x <= 5; x++) {
        for (let z = -5; z <= 5; z++) {
            // Top layer lipid
            const topLipid = new THREE.Group();
            const topHead = new THREE.Mesh(headGeo, headMat);
            topHead.position.y = 1;
            const topTail1 = new THREE.Mesh(tailGeo, tailMat);
            topTail1.position.set(-0.2, 0, 0);
            const topTail2 = new THREE.Mesh(tailGeo, tailMat);
            topTail2.position.set(0.2, 0, 0);
            topLipid.add(topHead, topTail1, topTail2);
            topLipid.position.set(x * 1.1, 0, z * 1.1);
            bilayerGroup.add(topLipid);

            // Bottom layer lipid
            const botLipid = new THREE.Group();
            const botHead = new THREE.Mesh(headGeo, headMat);
            botHead.position.y = -1;
            const botTail1 = new THREE.Mesh(tailGeo, tailMat);
            botTail1.position.set(-0.2, 0, 0);
            const botTail2 = new THREE.Mesh(tailGeo, tailMat);
            botTail2.position.set(0.2, 0, 0);
            botLipid.add(botHead, botTail1, botTail2);
            botLipid.rotation.x = Math.PI; // point tails up
            botLipid.position.set(x * 1.1, -1, z * 1.1);
            bilayerGroup.add(botLipid);
        }
    }

    group.add(bilayerGroup);

    // Simple wave animation
    const times = [0, 2, 4];
    const values = [0, 0, 0, 0, 0.5, 0, 0, 0, 0];
    const posTrack = new THREE.VectorKeyframeTrack('.position', times, values);
    const clip = new THREE.AnimationClip('MembraneWave', 4, [posTrack]);

    return { group, animationClips: [clip] };
}
