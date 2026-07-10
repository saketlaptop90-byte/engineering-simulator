export function createKeplerianOrbit(THREE) {
    const group = new THREE.Group();
    group.name = 'KeplerianGroup';
    const animationClips = [];

    const starMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffcc00, emissiveIntensity: 0.8 });
    const planetMat = new THREE.MeshStandardMaterial({ color: 0x00ccff });

    const star = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), starMat);
    const planet = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), planetMat);
    planet.name = 'KeplerPlanet';
    
    group.add(star);
    group.add(planet);

    // Approximate Keplerian motion with keyframes
    const times = [];
    const values = [];
    const numFrames = 60;
    const duration = 10;
    const a = 10;
    const e = 0.7; // high eccentricity
    
    for (let i = 0; i <= numFrames; i++) {
        const M = (i / numFrames) * Math.PI * 2;
        // Solve Kepler's equation M = E - e*sin(E)
        let E = M;
        for (let j = 0; j < 5; j++) {
            E = M + e * Math.sin(E);
        }
        
        const x = a * (Math.cos(E) - e);
        const y = a * Math.sqrt(1 - e*e) * Math.sin(E);
        
        times.push((i / numFrames) * duration);
        values.push(x, 0, y);
    }
    
    const track = new THREE.VectorKeyframeTrack('KeplerPlanet.position', times, values);
    const clip = new THREE.AnimationClip('KeplerMotion', duration, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
