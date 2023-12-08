import styles from './main.module.scss'
import { useEffect, useState } from 'react'

export default function Main() {
    const [citys, setCitys] = useState([]);
    const [newCityProps, setNewCityProps] = useState([{
        city: '',
        y: '',
        x: ''
    }])
    const [msgError, setMsgError] = useState(``);
    const [bestRoute, setBestRoute] = useState([]);

    function createCity() {
        setMsgError('');
        if(newCityProps[0].city == "" || newCityProps[0].y == "" || newCityProps[0]?.x == "") {
            setMsgError('Todos os campos são obrigatorios');
        } else {
            const cd = [...citys];
            cd.push(newCityProps[0]);
            setCitys([...cd]);
            setNewCityProps([{
                city: '',
                y: '',
                x: ''
            }])
        }
    }

    async function gerRoute() {
        await fetch('/getBestRoute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(citys)
        }).then(async (response) => {
            const data = await response.json();
            console.log(data)
            setBestRoute([...data]);
        })
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1>RoutAnchieasy</h1>
                    <p>Simule a melhor routerização</p>
                    <div className={styles.orientation}>
                        <div className={styles.boxPropsCitys}>
                            <div className={styles.boxWriteCitys}>
                                <h1>Adicione as informações das cidades/bairro</h1>
                                <div className={styles.questionCity}>
                                    <h1>Cidade/Bairro</h1>
                                    <input type="text" value={newCityProps[0].city} onChange={(e) => {
                                        let tmpArr = [...newCityProps];

                                        tmpArr[0].city = e.target.value.toUpperCase();
                                        setNewCityProps([...tmpArr]);
                                    }}/>
                                </div>
                                <div className={styles.questionCity}>
                                    <h1>Latitude (y)</h1>
                                    <input type="number" value={newCityProps[0].y} onChange={(e) => {
                                        let tmpArr = [...newCityProps];

                                        tmpArr[0].y = e.target.value.toUpperCase();
                                        setNewCityProps([...tmpArr]);
                                    }}/>
                                </div>
                                <div className={styles.questionCity}>
                                    <h1>Longitude (x)</h1>
                                    <input type="number" value={newCityProps[0].x} onChange={(e) => {
                                        let tmpArr = [...newCityProps];

                                        tmpArr[0].x = e.target.value.toUpperCase();
                                        setNewCityProps([...tmpArr]);
                                    }}/>
                                </div>
                                <p>{msgError}</p>
                                <div className={styles.buttonCity}>
                                    <button onClick={()=>createCity()}>Adicionar cidade/bairro</button>
                                </div>
                            </div>
                            <div className={styles.boxWriteCitys}>
                                <h1>Cidades/Bairros</h1>
                                {citys.length > 1 ? <div className={styles.buttonRota}>
                                    <button onClick={()=>gerRoute()}>Calcular melhor rota</button>
                                </div>:null}
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Cidade/Bairro</th>
                                            <th>Latitude (y)</th>
                                            <th>Longitude (x)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {citys.map((props, index) => {
                                            return (
                                                <>
                                                    <tr key={index.toString()}>
                                                        <th>{props.city}</th>
                                                        <th>{props.y}</th>
                                                        <th>{props.x}</th>
                                                    </tr>
                                                </>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className={styles.result}>
                            <h1>Melhor rota encontrada</h1>
                            <div className={styles.linResult}>
                                {bestRoute.map((props) => {
                                    return(
                                    <>
                                        <div className={styles.city}>
                                            <h1>{props}</h1>
                                            <img src="/receiving.svg"/>
                                        </div>
                                        <img src="/arrowgo.svg"/>
                                    </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}