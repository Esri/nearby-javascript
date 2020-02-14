import { Dialog, DialogActions, DialogButton, DialogContent, DialogTitle } from '@rmwc/Dialog';
import React, { useContext } from 'react';

import { AppContext } from '../contexts/App';
import CategoryList from './CategoryList';

const CategoryFilter = () => {
    const { state, setState } = useContext(AppContext);

    return (
        <Dialog
            open={state.showFilter}
            onClose={({ detail }: any) => {
                if (detail.action === 'cancel') {
                    setState({
                        showFilter: false,
                    });
                } else if (detail.action === 'apply') {
                    setState({
                        showFilter: false,
                        redoSearch: true,
                    });
                }
            }}
        >
            <DialogTitle>Filter Places</DialogTitle>
            <DialogContent>
                <CategoryList />
            </DialogContent>
            <DialogActions>
                <DialogButton action="cancel">Cancel</DialogButton>
                <DialogButton action="apply" isDefaultAction>
                    Apply
                </DialogButton>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryFilter;
