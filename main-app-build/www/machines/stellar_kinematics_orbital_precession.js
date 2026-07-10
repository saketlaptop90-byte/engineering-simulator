export function createOrbitalPrecession(THREE) {
    const group = new THREE.Group();
    group.name = 'PrecessionGroup';
    const animationClips = [];

    const centralMassMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffaa00, emissiveIntensity: 0.8 });
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });

    const centralMass = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), centralMassMaterial);
    
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitPoints = [];
    for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        const r = 8 * (1 - 0.6 * 0.6) / (1 + 0.6 * Math.cos(theta));
        orbitPoints.push(new THREE.Vector3(r * Math.cos(theta), 0, r * Math.sin(theta)));
    }
    orbitGeometry.setFromPoints(orbitPoints);
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);

    const orbitGroup = new THREE.Group();
    orbitGroup.name = 'OrbitSystem';
    orbitGroup.add(orbitLine);
    
    group.add(centralMass);
    group.add(orbitGroup);

    const times = [0, 5, 10];
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    const values = [...q0.toArray(), ...q1.toArray(), ...q2.toArray()];

    const precessionTrack = new THREE.QuaternionKeyframeTrack('OrbitSystem.quaternion', times, values);
    const clip = new THREE.AnimationClip('PrecessionAnim', 10, [precessionTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
