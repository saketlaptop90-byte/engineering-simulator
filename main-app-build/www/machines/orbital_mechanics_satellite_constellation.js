export function createSatelliteConstellation(THREE) {
    const group = new THREE.Group();
    
    const earthGeom = new THREE.SphereGeometry(5, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({ color: 0x1144aa });
    const earth = new THREE.Mesh(earthGeom, earthMat);
    group.add(earth);
    
    const orbitRadius = 8;
    const numPlanes = 3;
    const satsPerPlane = 4;
    
    const satGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const satMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    
    const tracks = [];
    const duration = 10;
    const times = [];
    for (let i = 0; i <= 100; i++) {
        times.push((i / 100) * duration);
    }
    
    for (let p = 0; p < numPlanes; p++) {
        const planeAngle = (p / numPlanes) * Math.PI;
        for (let s = 0; s < satsPerPlane; s++) {
            const sat = new THREE.Mesh(satGeom, satMat);
            sat.name = `Sat_${p}_${s}`;
            group.add(sat);
            
            const phaseOffset = (s / satsPerPlane) * Math.PI * 2;
            const values = [];
            
            for (let i = 0; i <= 100; i++) {
                const angle = phaseOffset + (i / 100) * Math.PI * 2;
                
                const xBase = orbitRadius * Math.cos(angle);
                const yBase = orbitRadius * Math.sin(angle);
                const zBase = 0;
                
                const x = xBase * Math.cos(planeAngle) - zBase * Math.sin(planeAngle);
                const z = xBase * Math.sin(planeAngle) + zBase * Math.cos(planeAngle);
                
                values.push(x, yBase, z);
            }
            
            const track = new THREE.VectorKeyframeTrack(sat.name + '.position', times, values);
            tracks.push(track);
        }
    }
    
    const clip = new THREE.AnimationClip('ConstellationOrbit', duration, tracks);
    
    return { group, animationClips: [clip] };
}
