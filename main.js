(function main() {
    class Bezier {
        showingLinesAndPoints = true;

        distance(a, b){
            return Math.sqrt(Math.pow(a[0]-b[0], 2) + Math.pow(a[1]-b[1], 2));
        }
        /*
        * Вычисление факториала
         */
        fact(value){
            if(value ===0 || value ===1){
                return 1;
            }
            else{
                return value  * this.fact(value -1);
            }
        }
        /*
        * Вычисление полинома Бернштейна
         */
        bernstein(i,n,t){
            return this.fact(n) / (this.fact(i) * this.fact(n-i))* Math.pow(t, i) * Math.pow(1-t, n-i);
        }
        /*
        * Вычисление значний координат точек
         */
        points(t, points){
            const r = [0,0];
            const n = points.length-1;
            for(let i=0; i <= n; i++){
                r[0] += points[i][0] * this.bernstein(i, n, t);
                r[1] += points[i][1] * this.bernstein(i, n, t);
            }
            return r;
        }
        computeSupportPoints(points) {
            let tLength = 0;
            for(let i=0; i< points.length-1; i++){
                tLength += this.distance(points[i], points[i+1]);
            }
            const step = 1 / tLength;

            const temp = [];
            for(let t=0;t<=1; t=t+step){
                const p = this.points(t, points);
                temp.push(p);
            }
            return temp;
        }
        paintPoint(ctx, color,  point){
            ctx.save();
            switch(color){
                case 'red':
                    ctx.strokeStyle = "rgb(200, 0,0)";
                    ctx.strokeRect(point[0]- 3 , point[1] - 3, 6, 6);
                    break;

                case 'black':
                    ctx.strokeStyle = "rgb(0, 0,0)";
                    ctx.strokeRect(point[0]- 1 , point[1] - 1, 2, 2);
                    break;

                case 'green':
                    ctx.strokeStyle = "rgb(0, 200,0)";
                    ctx.strokeRect(point[0]- 2 , point[1] - 2, 4, 4);
                    break;
            }
            ctx.restore();
        }
        paintPoints(ctx, points, color){
            ctx.save();

            ctx.strokeStyle = '#CCCCCC';
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            for(let i=1;i<points.length; i++){
                ctx.lineTo(points[i][0], points[i][1]);
            }
            ctx.stroke();

            for(let i=0;i<points.length; i++){
                this.paintPoint(ctx, color, points[i]);
                ctx.fillText("P" + i + " [" + points[i][0] + ',' + points[i][1] + ']', points[i][0], points[i][1] - 10);
            }


            ctx.restore();
        }
        paintCurve(ctx, points){
            ctx.save();

            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            for(let i=1;i<points.length; i++){
                ctx.lineTo(points[i][0], points[i][1]);
            }
            ctx.stroke();
            ctx.restore();
        }
    }

    const bezier = new Bezier()
    const container = document.getElementById('container');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext("2d");
    const add = document.getElementById('add');
    const draw = document.getElementById('draw');
    const clear = document.getElementById('clear');
    let ui = document.getElementsByClassName('ui')[0];
    let clearUi = ui.cloneNode(true);

    add.addEventListener('click', () => {
        const li = ui.firstElementChild.cloneNode(true);
        li.style.display = 'list-item';
        ui.appendChild(li);
    });

    clear.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ui.remove();
        ui = clearUi;
        clearUi = ui.cloneNode(true);
        container.appendChild(ui);
    })

    draw.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const initialPoints = [];
        const input = document.getElementsByTagName('input');
        for (let i=2; i<input.length; i=i+2) {
            initialPoints.push([input[i].value, input[i+1].value]);
        }
        const supportPoints = bezier.computeSupportPoints(initialPoints);
        bezier.paintCurve(ctx, supportPoints);
        if(bezier.showingLinesAndPoints){
            bezier.paintPoints(ctx, initialPoints, "red");
        }
    });
})();