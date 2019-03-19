import { Autowired, Bean, PostConstruct } from "../context/context";
import { RowNode } from "../entities/rowNode";
import { FilterManager } from "../filter/filterManager";
import { GridOptionsWrapper } from "../gridOptionsWrapper";
import { ChangedPath } from "../rowModels/clientSide/changedPath";

@Bean("filterService")
export class FilterService {

    @Autowired('filterManager') private filterManager: FilterManager;
    @Autowired('gridOptionsWrapper') private gridOptionsWrapper: GridOptionsWrapper;

    private doingTreeData: boolean;

    @PostConstruct
    private postConstruct(): void {
        this.doingTreeData = this.gridOptionsWrapper.isTreeData();
    }

    public filter(changedPath: ChangedPath): void {
        const filterActive: boolean = this.filterManager.isAnyFilterPresent();
        this.filterNode(filterActive, changedPath);
    }

    private filterNode(filterActive: boolean, changedPath: ChangedPath): void {

        const callback = (rowNode: RowNode) => {
            // recursively get all children that are groups to also filter
            if (rowNode.hasChildren()) {

                // result of filter for this node
                if (filterActive) {
                    rowNode.childrenAfterFilter = rowNode.childrenAfterGroup.filter(childNode => {
                        // a group is included in the result if it has any children of it's own.
                        // by this stage, the child groups are already filtered
                        const passBecauseChildren = childNode.childrenAfterFilter && childNode.childrenAfterFilter.length > 0;

                        // both leaf level nodes and tree data nodes have data. these get added if
                        // the data passes the filter
                        const passBecauseDataPasses = childNode.data && this.filterManager.doesRowPassFilter(childNode);

                        // note - tree data nodes pass either if a) they pass themselves or b) any children of that node pass

                        return passBecauseChildren || passBecauseDataPasses;
                    });
                } else {
                    // if not filtering, the result is the original list
                    rowNode.childrenAfterFilter = rowNode.childrenAfterGroup;
                }

                this.setAllChildrenCount(rowNode);

            } else {
                rowNode.childrenAfterFilter = rowNode.childrenAfterGroup;
                rowNode.setAllChildrenCount(null);
            }
        };

        changedPath.forEachChangedNodeDepthFirst(callback, true);

/*
        // recursively get all children that are groups to also filter
        if (rowNode.hasChildren()) {

            rowNode.childrenAfterGroup.forEach(node => this.filterNode(node, filterActive));

            // result of filter for this node
            if (filterActive) {
                rowNode.childrenAfterFilter = rowNode.childrenAfterGroup.filter(childNode => {
                    // a group is included in the result if it has any children of it's own.
                    // by this stage, the child groups are already filtered
                    const passBecauseChildren = childNode.childrenAfterFilter && childNode.childrenAfterFilter.length > 0;

                    // both leaf level nodes and tree data nodes have data. these get added if
                    // the data passes the filter
                    const passBecauseDataPasses = childNode.data && this.filterManager.doesRowPassFilter(childNode);

                    // note - tree data nodes pass either if a) they pass themselves or b) any children of that node pass

                    return passBecauseChildren || passBecauseDataPasses;
                });
            } else {
                // if not filtering, the result is the original list
                rowNode.childrenAfterFilter = rowNode.childrenAfterGroup;
            }

            this.setAllChildrenCount(rowNode);

        } else {
            rowNode.childrenAfterFilter = rowNode.childrenAfterGroup;
            rowNode.setAllChildrenCount(null);
        }
*/
    }

    private setAllChildrenCountTreeData(rowNode: RowNode) {
        // for tree data, we include all children, groups and leafs
        let allChildrenCount = 0;
        rowNode.childrenAfterFilter.forEach((child: RowNode) => {
            // include child itself
            allChildrenCount++;
            // include children of children
            allChildrenCount += child.allChildrenCount as any;
        });
        rowNode.setAllChildrenCount(allChildrenCount);
    }

    private setAllChildrenCountGridGrouping(rowNode: RowNode) {
        // for grid data, we only count the leafs
        let allChildrenCount = 0;
        rowNode.childrenAfterFilter.forEach((child: RowNode) => {
            if (child.group) {
                allChildrenCount += child.allChildrenCount as any;
            } else {
                allChildrenCount++;
            }
        });
        rowNode.setAllChildrenCount(allChildrenCount);
    }

    private setAllChildrenCount(rowNode: RowNode) {
        if (this.doingTreeData) {
            this.setAllChildrenCountTreeData(rowNode);
        } else {
            this.setAllChildrenCountGridGrouping(rowNode);
        }
    }
}