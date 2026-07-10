export function createTwoBodyOrbit(THREE) {
    const group = new THREE.Group();
    
    const earthGeometry = new THREE.SphereGeometry(2, 32, 32);
    const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x2233ff, roughness: 0.5 });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    
    const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.8 });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(10, 0, 0);
    moon.name = "Moon";
    
    group.add(earth);
    group.add(moon);
    
    const times = [];
    const values = [];
    const numFrames = 100;
    for (let i = 0; i <= numFrames; i++) {
        const t = (i / numFrames) * 10;
        const angle = (i / numFrames) * Math.PI * 2;
        times.push(t);
        values.push(Math.cos(angle) * 10, 0, Math.sin(angle) * 10);
    }
    
    const track = new THREE.VectorKeyframeTrack(moon.name + '.position', times, values);
    const clip = new THREE.AnimationClip('MoonOrbit', 10, [track]);
    
    return { group, animationClips: [clip] };
}
