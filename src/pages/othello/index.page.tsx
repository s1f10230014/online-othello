import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import { userAtom } from '../../atoms/user';
import { BasicHeader } from '../@components/BasicHeader/BasicHeader';
import styles from './othello.module.css';

const Home = () => {
  const [user] = useAtom(userAtom);
  const turnColor_state: string[] = ['終わり', '白の番', '黒の番'];
  const [turnColor, setturnColor] = useState<number>();

  const [board, setboard] = useState<number[][]>();

  const fetchBoard = async () => {
    const res = await apiClient.board.$get().catch(returnNull);

    if (res !== null) {
      setboard(res.board);
      setturnColor(res.turnColor);
    }
  };

  const clickCell = async (x: number, y: number) => {
    await apiClient.board.$post({ body: { x, y } });
    await fetchBoard();
  };

  useEffect(() => {
    const cancellid = setInterval(fetchBoard, 500);
    return () => {
      clearInterval(cancellid);
    };
  }, []);

  if (!user || !board || !turnColor) return <Loading visible />;

  return (
    <>
      <BasicHeader user={user} />
      <div className={styles.container}>
        <div className={styles.game_table}>
          <p>{turnColor === 1 ? '黒' : '白'}のターンです。</p>
        </div>
        {/* <div className={styles.caveat}>
          {white_pass_count === 1 && (
            <p>警告!pass2回で負け判定になります。只今の白pass{white_pass_count}です。</p>
          )}
        </div> */}
        {/* <div className={styles.caveat}>
          {black_pass_count === 1 && (
            <p>警告!pass2回で負け判定になります。只今の黒pass{black_pass_count}です。</p>
          )} */}
        {/* </div>
        <div className={styles.caveat}>{white_pass_count === 2 && <p>警告!白の負けです。</p>}</div>
        <div className={styles.caveat}>{black_pass_count === 2 && <p>警告！黒の負けです。</p>}</div> */}
        {/* </div> */}
        {/* <div className={styles.pass_button} onClick={() => clickCell(100, 100)}>
          <p>pass</p>
        </div> */}
        <div className={styles.board}>
          {board.map((row, y) =>
            row.map((cell, x) => (
              <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickCell(x, y)}>
                {cell !== 0 && cell !== 7 && (
                  <div
                    className={styles.storn}
                    style={{ background: cell === 1 ? '#131212' : '#c3c3c3' }}
                  />
                )}

                {cell === 7 && <div className={styles.signpost} key={`${x}-${y}`} />}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
