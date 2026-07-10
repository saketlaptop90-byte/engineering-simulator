export function createNavierStokesGrid(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const gridSize = 10;
    const spacing = 1.0;
    
    // Create a grid of arrows
    const dir = new THREE.Vector3( 1, 0, 0 );
    const origin = new THREE.Vector3( 0, 0, 0 );
    const hex = 0x00ff00;

    const arrows = [];
    for (let i = -gridSize/2; i < gridSize/2; i++) {
        for (let j = -gridSize/2; j < gridSize/2; j++) {
            const arrowOrigin = new THREE.Vector3(i * spacing, 0, j * spacing);
            const arrowHelper = new THREE.ArrowHelper(dir, arrowOrigin, 0.8, hex, 0.2, 0.2);
            arrows.push({ arrow: arrowHelper, x: i, z: j });
            group.add(arrowHelper);
        }
    }

    const dummy = new THREE.Object3D();
    const track = new THREE.NumberKeyframeTrack('.position[x]', [0, 10], [0, 10]);
    const clip = new THREE.AnimationClip('NSGridAnim', 10, [track]);
    animationClips.push(clip);

    group.userData.update = (dt, time) => {
        // Simulate a divergence-free vector field changing over time
        arrows.forEach(item => {
            const vx = Math.sin(item.z * 0.5 + time) * Math.cos(item.x * 0.2);
            const vz = Math.cos(item.x * 0.5 + time) * Math.sin(item.z * 0.2);
            const vec = new THREE.Vector3(vx, 0, vz);
            const len = vec.length();
            if (len > 0.001) {
                vec.normalize();
                item.arrow.setDirection(vec);
                item.arrow.setLength(0.2 + len * 0.6, 0.2, 0.2);
                
                // Color based on vorticity/velocity
                const color = new THREE.Color();
                color.setHSL(0.6 - len * 0.3, 1.0, 0.5);
                item.arrow.setColor(color);
            }
        });
    };

    return { group, animationClips };
}
