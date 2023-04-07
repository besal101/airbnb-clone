import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

import { SafeUser } from '@/types';

import useLoginModal from './useLoginModal';

interface IUseFavorite {
    listingId: string;
    currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
    const router = useRouter();
    const loginModal = useLoginModal();

    const hasFavourited = useMemo(() => {
        const list = currentUser?.favouriteIds || [];
        return list.includes(listingId);
    }, [currentUser, listingId]);

    const togglefavourite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!currentUser) {
            return loginModal.onOpen();
        }
        try {
            let request;
            if (hasFavourited) {
                request = () => axios.delete(`/api/favorites/${listingId}`);
            } else {
                request = () => axios.post(`/api/favorites/${listingId}`);
            }
            await request();
            router.refresh();
            toast.success('Successfully updated your favourites');
        } catch (err: any) {
            toast.error(err.message);
        }
    }, [currentUser, hasFavourited, listingId, loginModal, router]);

    return {
        hasFavourited,
        togglefavourite
    }
}

export default useFavorite;
