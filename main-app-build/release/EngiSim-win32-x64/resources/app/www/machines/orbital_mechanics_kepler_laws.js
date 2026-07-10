export function createKeplersLaws(THREE) {
    const group = new THREE.Group();
    
    const starGeom = new THREE.SphereGeometry(2, 32, 32);
    const starMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffcc00 });
    const star = new THREE.Mesh(starGeom, starMat);
    star.position.set(-6, 0, 0);
    group.add(star);
    
    const planetGeom = new THREE.SphereGeometry(0.5, 32, 32);
    const planetMat = new THREE.MeshStandardMaterial({ color: 0x00aaff });
    const planet = new THREE.Mesh(planetGeom, planetMat);
    planet.name = "Planet";
    group.add(planet);
    
    const orbitMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    const points = [];
    for (let i = 0; i <= 100; i++) {
        const theta = (i / 100) * Math.PI * 2;
        const r = (10 * (1 - 0.6 * 0.6)) / (1 + 0.6 * Math.cos(theta));
        points.push(new THREE.Vector3(r * Math.cos(theta) - 6, 0, r * Math.sin(theta)));
    }
    const orbitGeom = new THREE.BufferGeometry().setFromPoints(points);
    const orbitLine = new THREE.Line(orbitGeom, orbitMat);
    group.add(orbitLine);
    
    const times = [];
    const values = [];
    const numFrames = 200;
    const duration = 20;
    
    for (let i = 0; i <= numFrames; i++) {
        const t = (i / numFrames) * duration;
        const M = (i / numFrames) * Math.PI * 2;
        
        let E = M;
        for(let iter=0; iter<5; iter++){
            E = E - (E - 0.6 * Math.sin(E) - M) / (1 - 0.6 * Math.cos(E));
        }
        
        const a = 10;
        const e = 0.6;
        const b = a * Math.sqrt(1 - e*e);
        
        values.push(a * Math.cos(E), 0, b * Math.sin(E));
    }
    
    const track = new THREE.VectorKeyframeTrack(planet.name + '.position', times, values);
    const clip = new THREE.AnimationClip('KeplersOrbit', duration, [track]);
    
    return { group, animationClips: [clip] };
}
