export function createHohmannTransfer(THREE) {
    const group = new THREE.Group();
    
    const sunGeom = new THREE.SphereGeometry(3, 32, 32);
    const sunMat = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00 });
    const sun = new THREE.Mesh(sunGeom, sunMat);
    
    const earthOrbitPath = new THREE.RingGeometry(9.9, 10.1, 64);
    const orbitMat = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide });
    const earthOrbit = new THREE.Mesh(earthOrbitPath, orbitMat);
    earthOrbit.rotation.x = Math.PI / 2;
    
    const marsOrbitPath = new THREE.RingGeometry(14.9, 15.1, 64);
    const marsOrbit = new THREE.Mesh(marsOrbitPath, orbitMat);
    marsOrbit.rotation.x = Math.PI / 2;
    
    const spacecraftGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const spacecraftMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const spacecraft = new THREE.Mesh(spacecraftGeom, spacecraftMat);
    spacecraft.name = "Spacecraft";
    
    group.add(sun);
    group.add(earthOrbit);
    group.add(marsOrbit);
    group.add(spacecraft);
    
    const times = [];
    const values = [];
    const numFrames = 100;
    for (let i = 0; i <= numFrames; i++) {
        const t = (i / numFrames) * 20;
        const angle = (i / numFrames) * Math.PI;
        const a = 12.5;
        const e = 0.2;
        const r = (a * (1 - e * e)) / (1 + e * Math.cos(angle));
        times.push(t);
        values.push(r * Math.cos(angle), 0, r * Math.sin(angle));
    }
    
    const track = new THREE.VectorKeyframeTrack(spacecraft.name + '.position', times, values);
    const clip = new THREE.AnimationClip('TransferOrbit', 20, [track]);
    
    return { group, animationClips: [clip] };
}
