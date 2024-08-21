import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Element from './element';
import { PlayerService } from '../../../services/playerService';
import { useParams } from 'react-router-dom';

function Player() {

    const { id } = useParams();
    const [ data, setData ] = useState({});
    const [ relatedData, setRelatedData ] = useState({});
    const [ isLoading, setIsLoading ] = useState(true);

    const columns = [
        { name: 'name', label: 'Name' },
        { name: 'createdAt', label: 'Started on' },
        { name: 'averageScore', label: 'Average Score' },
        { name: 'topScore', label: 'Top Score' },
        { name: 'lastActivity', label: 'Last Active on' },
        { name: 'gamesPlayed', label: 'Total Games Played' }
    ];

    const relatedColumns = [
        { name: 'createdAt', label: 'Date' },
        { name: 'value', label: 'Score' }
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const player = await PlayerService.getById(id);
            const stats = await PlayerService.getStatsById(id);
            setData({...player, ...stats});
            const scores = await PlayerService.getScoresByPlayerId(id);
            setRelatedData(scores);
        } catch (error) {
            console.error('Failed to fetch player:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Element 
                data={data} 
                columns={columns} 
                isLoading={isLoading} 
                relatedResource={"scores"} 
                relatedData={relatedData} 
                relatedColumns={relatedColumns} 
            />
        </div>
    );
};

export default Player;