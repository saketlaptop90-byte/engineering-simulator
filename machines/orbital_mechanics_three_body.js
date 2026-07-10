export function createThreeBodyProblem(THREE) {
    const group = new THREE.Group();
    
    const mat1 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const mat2 = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const mat3 = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    
    const geom = new THREE.SphereGeometry(1, 32, 32);
    
    const body1 = new THREE.Mesh(geom, mat1);
    body1.name = "Body1";
    const body2 = new THREE.Mesh(geom, mat2);
    body2.name = "Body2";
    const body3 = new THREE.Mesh(geom, mat3);
    body3.name = "Body3";
    
    group.add(body1);
    group.add(body2);
    group.add(body3);
    
    const times = [];
    const val1 = [];
    const val2 = [];
    const val3 = [];
    const numFrames = 200;
    for (let i = 0; i <= numFrames; i++) {
        const t = (i / numFrames) * 20;
        const phase = (i / numFrames) * Math.PI * 2;
        
        times.push(t);
        val1.push(Math.sin(phase) * 5, Math.sin(phase * 2) * 2, 0);
        val2.push(Math.sin(phase + 2*Math.PI/3) * 5, Math.sin((phase + 2*Math.PI/3)*2) * 2, 0);
        val3.push(Math.sin(phase + 4*Math.PI/3) * 5, Math.sin((phase + 4*Math.PI/3)*2) * 2, 0);
    }
    
    const track1 = new THREE.VectorKeyframeTrack(body1.name + '.position', times, val1);
    const track2 = new THREE.VectorKeyframeTrack(body2.name + '.position', times, val2);
    const track3 = new THREE.VectorKeyframeTrack(body3.name + '.position', times, val3);
    
    const clip = new THREE.AnimationClip('Figure8Orbit', 20, [track1, track2, track3]);
    
    return { group, animationClips: [clip] };
}
