export function createContextSwitch(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const cpuMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6 });
    const pcb1Mat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const pcb2Mat = new THREE.MeshStandardMaterial({ color: 0x0000ff });

    const cpu = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), cpuMat);
    group.add(cpu);

    const pcb1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 2), pcb1Mat);
    pcb1.name = "pcb1";
    pcb1.position.set(-5, 0, 0);
    group.add(pcb1);

    const pcb2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 2), pcb2Mat);
    pcb2.name = "pcb2";
    pcb2.position.set(5, 0, 0);
    group.add(pcb2);

    const times = [0, 2, 4, 6];
    const positions1 = [0, 0, 0,  -5, 0, 0,  -5, 0, 0,  -5, 0, 0];
    const positions2 = [5, 0, 0,  5, 0, 0,   0, 0, 0,   0, 0, 0];
    
    const track1 = new THREE.VectorKeyframeTrack('pcb1.position', times, positions1);
    const track2 = new THREE.VectorKeyframeTrack('pcb2.position', times, positions2);
    
    const clip = new THREE.AnimationClip('Context_Switch_Anim', 6, [track1, track2]);
    animationClips.push(clip);

    return { group, animationClips };
}
