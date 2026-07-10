export function createEpidemicCurvePlotter(THREE) {
    const group = new THREE.Group();

    const dataPoints = [2, 5, 12, 25, 45, 60, 80, 65, 40, 20, 10, 5, 2, 8, 15, 22, 18, 9, 3];
    const bars = [];

    const matNormal = new THREE.MeshStandardMaterial({ color: 0x3498db });
    const matWave2 = new THREE.MeshStandardMaterial({ color: 0xe67e22 });
    
    const boxGeo = new THREE.BoxGeometry(0.8, 1, 0.8);
    boxGeo.translate(0, 0.5, 0);

    dataPoints.forEach((val, idx) => {
        const mat = idx > 12 ? matWave2 : matNormal;
        const bar = new THREE.Mesh(boxGeo, mat);
        bar.name = `Bar${idx}`;
        bar.position.set(idx - (dataPoints.length / 2), 0, 0);
        bar.scale.set(1, 0.01, 1); // Start flat
        group.add(bar);
        bars.push({ mesh: bar, value: val / 10 });
    });

    // Animate bars growing sequentially
    const tracks = [];
    const totalTime = 5;
    const timePerBar = totalTime / dataPoints.length;

    bars.forEach((barObj, idx) => {
        const startTime = idx * timePerBar;
        const endTime = startTime + 0.5;
        
        const times = [0, startTime, endTime, totalTime];
        const values = [
            1, 0.01, 1, 
            1, 0.01, 1, 
            1, barObj.value, 1, 
            1, barObj.value, 1
        ];

        const track = new THREE.VectorKeyframeTrack(`${barObj.mesh.name}.scale`, times, values);
        tracks.push(track);
    });

    const clip = new THREE.AnimationClip('CurveGrowth', totalTime, tracks);

    return { group, animationClips: [clip] };
}
